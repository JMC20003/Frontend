import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonTool } from '@/shared/components/ButtonTool'
import { iconsSelect } from './icons/IconsSelect'
import { setDrawingMode } from '@/shared/redux/features/mapSlice'
import { createFeatureCollection, updateFeature } from '@/features/map/services/featureAPI'
import { updateGlobalStyle } from '@/features/map/services/styleAPI';
import { toast } from 'sonner'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { clearSelectedFeature } from '@/shared/redux/features/selectedFeatureSlice';
import { deleteFeature } from '@/features/map/services/featureAPI';
import { setRefreshFeatures } from '@/shared/redux/features/mapSlice';
import StyleControls from '../style/StyleControls';


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
	const [isEditing, setIsEditing] = useState(false);
	const dispatch = useDispatch();
	const { mapBoxDrawStateRef } = useSelector((state) => state.mapReducer);
	const { selectedFeatureId, selectedFeatureData } = useSelector((state) => state.selectedFeatureReducer); 
    const { fillColor, lineColor, pointColor, lineWidth, pointSize } = useSelector((state) => state.styleReducer);

  	const handleDelete = async () => {
    if (selectedFeatureId) {
      try {
        await deleteFeature(selectedFeatureId);
        dispatch(clearSelectedFeature());
        dispatch(setRefreshFeatures());
        toast.success("Feature eliminado correctamente");
      } catch (error) {
        console.error("Error deleting feature:", error);
        toast.error("Error al eliminar el feature");
      }
    }
  };

  const handleEdit = () => {
    if (selectedFeatureData && mapBoxDrawStateRef) {
      setIsEditing(true);
      mapBoxDrawStateRef.deleteAll();
      const featureIds = mapBoxDrawStateRef.add(selectedFeatureData);
      if (featureIds && featureIds.length > 0) {
        const featureId = featureIds[0];
        mapBoxDrawStateRef.changeMode('direct_select', { featureId: featureId });
      }
    }
  };


	const toolKeyToDrawMode = {
		poligono: 'draw_polygon',
		linea: 'draw_line_string',
		punto: 'draw_point',
		circulo: 'draw_circle',
		extension: 'draw_rectangle',
		lazo: 'draw_freehand'
	};

	const handleToolSelection = (toolKey) => {
		const drawMode = toolKeyToDrawMode[toolKey];
		if (drawMode) {
			dispatch(setDrawingMode(drawMode));
		} else {
			dispatch(setDrawingMode('simple_select'));
		}
	}

	const handleSave = async () => {
		if (!mapBoxDrawStateRef) {
			toast.error("Error: La referencia del control de dibujo no está disponible.");
			return;
		}

    try {
      await updateGlobalStyle({ fillColor, lineColor, pointColor, lineWidth, pointSize });
      toast.success("Estilos guardados correctamente.");
    } catch (error) {
      toast.error("Error al guardar los estilos.");
      console.error(error);
    }

		const drawnFeatures = mapBoxDrawStateRef.getAll();
		if (drawnFeatures.features.length === 0) {
			return;
		}

		if (isEditing) {
      const updatedFeature = drawnFeatures.features[0];
      try {
        await updateFeature(selectedFeatureId, updatedFeature);
        toast.success("Geometría actualizada correctamente.");
        mapBoxDrawStateRef.deleteAll();
        setIsEditing(false);
        dispatch(setRefreshFeatures());
      } catch (error) {
        toast.error("Error al actualizar la geometría.");
        console.error(error);
      }
    } else {
      const payload = {
        type: "FeatureCollection",
        features: drawnFeatures.features.map(f => {
          const { id, ...rest } = f;
          return rest;
        })
      };

      try {
        await createFeatureCollection(payload);
		dispatch(setRefreshFeatures());
        toast.success("Geometrías guardadas correctamente.");
        mapBoxDrawStateRef.deleteAll();
      } catch (error) {
        toast.error("Error al guardar las geometrías.");
        console.error(error);
      }
    }
	};

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
					<ButtonTool
						className='w-[70px] hover:bg-sky-200 h-full'
						icon={iconsSelect.opciones.exportar}
						label={iconsSelect.opciones.exportar.alt}
					/>
					{<StyleControls />}
          {selectedFeatureId && (
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
	)
}

export default SelectToolbar
