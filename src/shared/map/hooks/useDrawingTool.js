import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  setSelectedFeature,
  clearSelectedFeature,
  fetchFeatures
} from '@/shared/redux/features/featureSlice';
import { setActiveDrawMode } from '@/shared/redux/features/mapSlice';
import { getFeatureById, updateFeature, createFeatureCollection, deleteFeature } from '@/features/map/services/featureAPI';


export const useDrawingTool = () => {
  const dispatch = useDispatch();
  const mapBoxDrawStateRef = useSelector(state => state.mapReducer.mapBoxDrawStateRef);
  const mapInstanceFromRedux = useSelector(state => state.mapReducer.mapRef);
  const { selectedFeature } = useSelector(state => state.featureReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const clickListenerAttached = useRef(false);

  // Efecto para detectar cuando el mapa está listo
  useEffect(() => {
    if (mapInstanceFromRedux) {
      setIsMapReady(true);
    } else {
      setIsMapReady(false);
    }
  }, [mapInstanceFromRedux]);

  // Función estable para manejar clicks - usa useCallback para evitar re-creaciones
  const handleMapClick = useCallback(async (event) => {
    const map = mapInstanceFromRedux?.getMap();
    if (!map) return;

    console.log('Click event:', event);

    // Obtener layers dinámicamente en cada click
    const allLayers = map.getStyle()?.layers || [];
    const interactiveFeatureLayerIds = allLayers
      .filter(layer => layer.id.startsWith('feature-') || layer.id.startsWith('selected-backend-feature-'))
      .map(layer => layer.id);

    // Primero intentar con queryRenderedFeatures en el punto del click
    // Aumentar el área de detección en 8 píxeles alrededor del clic
    const clickBuffer = 8;
    const queriedFeatures = map.queryRenderedFeatures(
      [
        [event.point.x - clickBuffer, event.point.y - clickBuffer],
        [event.point.x + clickBuffer, event.point.y + clickBuffer]
      ],
      { layers: interactiveFeatureLayerIds }
    );

    console.log('Queried features:', queriedFeatures);

    let feature = queriedFeatures?.[0];

    if (!feature) {
      console.log('No feature detected. Clearing selection.');
      dispatch(clearSelectedFeature());
      return;
    }

    console.log('Feature detected:', feature);

    const backendId = feature.id || feature.properties?.id;

    if (!backendId) {
      console.warn('Feature clicked has no backend ID:', feature);
      dispatch(clearSelectedFeature());
      return;
    }

    try {
      console.log('Fetching feature with ID:', backendId);
      const response = await getFeatureById(backendId);
      console.log('Feature fetched from backend:', response);
      dispatch(setSelectedFeature(response));
      toast.success('Feature seleccionado');
    } catch (err) {
      console.error('Error fetching feature details:', err);
      toast.error('Error al cargar el feature');
      dispatch(clearSelectedFeature());
    }
  }, [dispatch, mapInstanceFromRedux]);

  // Función estable para cursor
  const handleMouseEnter = useCallback(() => {
    const map = mapInstanceFromRedux?.getMap();
    if (map) {
      map.getCanvas().style.cursor = 'pointer';
    }
  }, [mapInstanceFromRedux]);

  const handleMouseLeave = useCallback(() => {
    const map = mapInstanceFromRedux?.getMap();
    if (map) {
      map.getCanvas().style.cursor = '';
    }
  }, [mapInstanceFromRedux]);

  // Función para configurar listeners en los layers existentes
  const setupLayerListeners = useCallback(() => {
    const map = mapInstanceFromRedux?.getMap();
    if (!map) return () => { };

    const allLayers = map.getStyle()?.layers || [];
    const interactiveFeatureLayerIds = allLayers
      .filter(layer => layer.id.startsWith('feature-') || layer.id.startsWith('selected-backend-feature-'))
      .map(layer => layer.id);

    console.log('Setting up hover listeners for layers:', interactiveFeatureLayerIds);

    // Agregar event listeners para hover
    interactiveFeatureLayerIds.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.on('mouseenter', layerId, handleMouseEnter);
        map.on('mouseleave', layerId, handleMouseLeave);
      }
    });

    // Retornar función de limpieza
    return () => {
      interactiveFeatureLayerIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.off('mouseenter', layerId, handleMouseEnter);
          map.off('mouseleave', layerId, handleMouseLeave);
        }
      });
    };
  }, [mapInstanceFromRedux, handleMouseEnter, handleMouseLeave]);

  // Efecto para configurar el listener de click SOLO UNA VEZ
  useEffect(() => {
    if (!isMapReady || clickListenerAttached.current) {
      return;
    }

    const map = mapInstanceFromRedux.getMap();

    console.log('Setting up click listener (ONE TIME)');
    map.on('click', handleMapClick);
    clickListenerAttached.current = true;
    toast.success("Mapa listo para interacción con features.");

    return () => {
      console.log('Cleaning up click listener');
      map.off('click', handleMapClick);
      clickListenerAttached.current = false;
    };
  }, [isMapReady, mapInstanceFromRedux, handleMapClick]);

  // Efecto separado para los listeners de hover cuando cambian los layers
  useEffect(() => {
    if (!isMapReady) return;

    const map = mapInstanceFromRedux.getMap();

    // Esperar a que el estilo esté cargado
    const setupWhenReady = () => {
      if (map.isStyleLoaded()) {
        const cleanup = setupLayerListeners();
        return cleanup;
      }
    };

    // Intentar inmediatamente
    let cleanup = setupWhenReady();

    // Si no está listo, esperar el evento
    const onStyleData = () => {
      cleanup?.();
      cleanup = setupWhenReady();
    };

    map.on('styledata', onStyleData);

    return () => {
      map.off('styledata', onStyleData);
      cleanup?.();
    };
  }, [isMapReady, mapInstanceFromRedux, setupLayerListeners]);

  // Editar feature
  const handleEdit = useCallback(() => {
    if (!selectedFeature || !mapBoxDrawStateRef) {
      return;
    }

    setIsEditing(true);
    mapBoxDrawStateRef.deleteAll();

    // Si es FeatureCollection, tomar la primera feature
    const featureToEdit = selectedFeature.type === 'FeatureCollection'
      ? selectedFeature.features[0]
      : selectedFeature;

    if (!featureToEdit?.geometry) {
      toast.error("El feature seleccionado no tiene geometría válida.");
      return;
    }

    // Mapbox Draw necesita que el ID esté en el nivel superior del objeto feature
    const featureToAdd = { ...featureToEdit, id: featureToEdit.id || undefined };
    const featureIds = mapBoxDrawStateRef.add(featureToAdd);

    if (featureIds?.length) {
      mapBoxDrawStateRef.changeMode('direct_select', { featureId: featureIds[0] });
    } else {
      console.log('handleEdit: No feature IDs returned after adding to Mapbox Draw.');
    }
  }, [selectedFeature, mapBoxDrawStateRef]);

  // Guardar feature(s)
  const handleSave = useCallback(async () => {
    if (!mapBoxDrawStateRef) return;

    const drawn = mapBoxDrawStateRef.getAll();
    if (drawn.features.length === 0) return;

    if (isEditing && selectedFeature) {
      // Editing an existing feature
      try {
        const featureToUpdate = { ...drawn.features[0], id: selectedFeature.id };
        await updateFeature(featureToUpdate.id, featureToUpdate);
        toast.success("Geometría actualizada correctamente.");
        mapBoxDrawStateRef.deleteAll();
        setIsEditing(false);
        dispatch(fetchFeatures()); // Solo actualiza el source, no re-renderiza el hook
        dispatch(clearSelectedFeature());
      } catch (err) {
        console.error('Error al actualizar:', err);
        toast.error("Error al actualizar la geometría.");
      }
    } else {
      // Drawing a new feature
      const payload = {
        type: "FeatureCollection",
        features: drawn.features.map(f => {
          const { id, ...rest } = f;
          return rest;
        }),
      };
      try {
        await createFeatureCollection(payload);
        toast.success("Geometrías guardadas correctamente.");
        dispatch(fetchFeatures()); // Solo actualiza el source, no re-renderiza el hook
        mapBoxDrawStateRef.deleteAll();
      } catch (err) {
        console.error('Error al guardar:', err);
        toast.error("Error al guardar las geometrías.");
      }
    }
  }, [mapBoxDrawStateRef, isEditing, selectedFeature, dispatch]);

  // Eliminar feature
  const handleDelete = useCallback(async () => {
    if (!selectedFeature) return;
    try {
      await deleteFeature(selectedFeature.id);
      dispatch(fetchFeatures()); // Solo actualiza el source, no re-renderiza el hook
      dispatch(clearSelectedFeature());
      toast.success("Feature eliminado correctamente.");
    } catch (err) {
      console.error('Error al eliminar:', err);
      toast.error("Error al eliminar el feature.");
    }
  }, [selectedFeature, dispatch]);

  // Selección de herramienta
  const toolKeyToDrawMode = {
    poligono: 'draw_polygon',
    linea: 'draw_line_string',
    punto: 'draw_point',
    circulo: 'draw_circle',
    extension: 'draw_rectangle',
    lazo: 'draw_freehand'
  };

  const handleToolSelection = useCallback((toolKey) => {
    const drawMode = toolKeyToDrawMode[toolKey] || 'simple_select';
    dispatch(setActiveDrawMode(drawMode));
  }, [dispatch]);

  return {
    handleDelete,
    handleEdit,
    handleSave,
    handleToolSelection,
    isEditing,
    selectedFeature,
  };
};