import { ButtonTool } from '@/shared/components/ButtonTool';
import { iconsSelect } from './icons/IconsSelect';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useState, useRef, useEffect } from 'react';


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

const SelectToolbar = ({ handleDelete, handleEdit, handleSave, handleToolSelection, selectedFeature }) => {

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
          <ButtonTool
            className='w-[70px] hover:bg-sky-200 h-full'
            icon={iconsSelect.opciones.exportar} // Re-using export icon for save
            label="Guardar"
            onClick={handleSave}
          />          
          {selectedFeature  && (
            <>
              <ButtonTool
                icon={<Pencil1Icon />}
                label="Editar"
                onClick={handleEdit}
                className='w-[70px] hover:bg-sky-200 h-full'
              />
              <ButtonTool
                icon={<TrashIcon />}
                label="Eliminar"
                onClick={handleDelete}
                className='w-[70px] hover:bg-sky-200 h-full'
              />
            </>
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