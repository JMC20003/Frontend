import { ButtonTool } from '@/shared/components/ButtonTool';
import { iconsSelect } from './icons/IconsSelect';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDrawingTool } from '@/shared/map/hooks/useDrawingTool';

const SelectDropdown = ({ onSelectTool }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedTool, setSelectedTool] = useState('seleccionar')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelectTool = (toolKey) => {
    setSelectedTool(toolKey)
    setShowDropdown(false)
    onSelectTool?.(toolKey)
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <ButtonTool
        className='w-[70px] hover:bg-sky-200 h-full'
        icon={iconsSelect.seleccion.seleccionar}
        label={iconsSelect.seleccion.seleccionar.alt}
        onClick={toggleDropdown}
      />

      {showDropdown && (
        <div className="fixed bg-white border border-gray-300 shadow-lg rounded-md min-w-[120px] z-10">
          <div className="p-2 flex flex-col gap-2">
            {Object.entries(iconsSelect.seleccionDropdown).map(([key, icon]) => (
              <ButtonTool
                key={key}
                className={`w-[128px] h-[60px] hover:bg-blue-100 border rounded 
								${selectedTool === key ? 'bg-blue-200 border-blue-400' : 'border-gray-200'}`}
                icon={icon}
                label={icon.alt}
                onClick={() => handleSelectTool(key)}
                layout='row'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const SelectToolbar = () => {
  // ✅ OBTENER drawRef desde Redux
  const drawRef = useSelector((state) => state.mapReducer.mapBoxDrawStateRef);

  // ✅ USAR el hook con el drawRef correcto
  const {
    handleEdit,
    handleSave,
    handleDelete,
    handleToolSelection,
    selectedFeature,
    isEditing
  } = useDrawingTool({ current: drawRef });

  return (
    <div className="flex items-center bg-white shadow-sm w-auto overflow-hidden text-[10px] gap-1 h-full">
      {/* Selección */}
      <div className="border-r border-gray-300 flex flex-col grow justify-between">
        <div className="flex items-center relative">
          <SelectDropdown onSelectTool={handleToolSelection} />
          <ButtonTool
            className='w-[70px] hover:bg-sky-200 h-full'
            icon={iconsSelect.seleccion.porAtributo}
            label={iconsSelect.seleccion.porAtributo.alt}
          />
          <ButtonTool
            className='w-[70px] hover:bg-sky-200 h-full'
            icon={iconsSelect.seleccion.porUbicacion}
            label={iconsSelect.seleccion.porUbicacion.alt}
          />
        </div>
        <span className="text-[12px] text-center text-gray-900">
          {iconsSelect.seleccion.section}
        </span>
      </div>

      {/* Opciones */}
      <div className="border-r border-gray-300 flex flex-col justify-between h-full">
        <div className="flex items-center h-full">
          {/* Botón Guardar - visible solo cuando hay algo dibujado o está editando */}
          {/* Botón Guardar - visible cuando hay algo dibujado */}
          <ButtonTool
            className={`w-[70px] h-full ${isEditing || !selectedFeature ? 'hover:bg-green-200' : 'hover:bg-sky-200 opacity-50'}`}
            icon={iconsSelect.opciones.exportar}
            label="Guardar"
            onClick={handleSave}
            disabled={false} // ⬅️ QUITAR LA CONDICIÓN QUE LO BLOQUEA
          />

          {/* Botón Editar - visible solo cuando hay feature seleccionado */}
          {selectedFeature && !isEditing && (
            <ButtonTool
              icon={<Pencil1Icon />}
              label="Editar"
              onClick={handleEdit}
              className='w-[70px] hover:bg-yellow-200 h-full'
            />
          )}

          {/* Botón Eliminar - visible solo cuando hay feature seleccionado */}
          {selectedFeature && (
            <ButtonTool
              icon={<TrashIcon />}
              label="Eliminar"
              onClick={handleDelete}
              className='w-[70px] hover:bg-red-200 h-full'
            />
          )}
        </div>
        <span className="text-[12px] text-center text-gray-900">
          {iconsSelect.opciones.section}
        </span>
      </div>
    </div>
  );
};

export default SelectToolbar;