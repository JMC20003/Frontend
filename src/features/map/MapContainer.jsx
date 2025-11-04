import { useEffect, useRef } from 'react'
import Map from 'react-map-gl/maplibre'
import mapLibregl from 'maplibre-gl'
import { useDispatch } from 'react-redux'
import { NavigationControl, ScaleControl } from 'react-map-gl'
import { toast } from 'sonner' // ⬅️ AGREGAR ESTO
import DrawControl from './components/toolbox/Toolbar'
import { CustomLayers } from './components/layers/CustomLayers'
import { FeatureLayer } from './components/layers/FeatureLayer'
import { setMapref, setMapboxDrawRef } from '@/shared/redux/features/mapSlice'
import { useGlobalState } from '@/shared/context/GlobalState'
import { useDrawingTool } from '@/shared/map/hooks/useDrawingTool'

export const MapContainer = () => {
  const dispatch = useDispatch()
  const mapRef = useRef(null)
  const drawControlRef = useRef(null)
  const { mapType } = useGlobalState()
  
  // 🧩 Usa el hook que gestiona la edición y guardado
  const { handleSelectFeature } = useDrawingTool(drawControlRef);

  const INITIAL_POSITION = { latitude: -12.02, longitude: -77.02 }
  const ZOOM = 9

  const onLoad = () => {
    dispatch(setMapref(mapRef.current))
    dispatch(setMapboxDrawRef(drawControlRef.current))
    
    // 🔹 Registrar evento de clic
    mapRef.current.on('click', 'barrios-layer', async (e) => {
      const feature = e.features?.[0]
      if (!feature) return

      // Obtener un atributo válido
      const { nombre, id, codigo } = feature.properties
      let filterField, filterValue

      if (nombre) { filterField = "nombre"; filterValue = nombre }
      else if (id) { filterField = "id"; filterValue = id }
      else if (codigo) { filterField = "codigo"; filterValue = codigo }
      else {
        console.warn("⚠️ Ningún campo válido para filtrar")
        return
      }

      const wfsUrl = `http://localhost:8080/geoserver/geosolution/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geosolution:barrios&outputFormat=application/json&CQL_FILTER=${filterField}='${encodeURIComponent(filterValue)}'`

      try {
        const res = await fetch(wfsUrl);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        const geojson = await res.json();
        if (!geojson.features?.length) {
          toast.warning("No se encontró el feature");
          return;
        }

        const polygon = geojson.features[0];
        const draw = drawControlRef.current;

        // Limpia y agrega la geometría al draw
        draw.deleteAll();
        const added = draw.add(polygon);
        // Activa modo selección
        draw.changeMode('simple_select', { featureIds: [added[0]] });
        // Guarda la selección en el estado
        handleSelectFeature(polygon);
        
      } catch (err) {
        console.error("🚨 Error al obtener feature WFS:", err);
        toast.error("Error al cargar la geometría");
      }
    })
  }

  const modeChange = (event) => {
    const mapCanvas = mapRef.current.getCanvas()
    switch (event.mode) {
      case 'direct_select':
        mapCanvas.classList.add("cursor-pointer-icon")
        break
      default:
        mapCanvas.classList.remove("cursor-pointer-icon")
    }
  }

  return (
    <Map
      ref={mapRef}
      onLoad={onLoad}
      attributionControl={false}
      initialViewState={{
        longitude: INITIAL_POSITION.longitude,
        latitude: INITIAL_POSITION.latitude,
        zoom: ZOOM
      }}
      mapLib={mapLibregl}
      mapStyle={mapType.source}
      style={{ width: '100dvw', height: '100dvh' }}
      preserveDrawingBuffer={true}
      interactiveLayerIds={['barrios-layer']}
    >
      <DrawControl ref={drawControlRef} position="top-left" modeChange={modeChange} />
      <NavigationControl position='top-left' />
      <ScaleControl position='bottom-left' maxWidth={100} unit='metric' />
      <CustomLayers />
      <FeatureLayer />
    </Map>
  )
}