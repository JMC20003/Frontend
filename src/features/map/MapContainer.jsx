import { useEffect, useRef } from 'react'
import Map from 'react-map-gl/maplibre';
import mapLibregl from 'maplibre-gl';
import { useDispatch } from 'react-redux';
import { NavigationControl, ScaleControl } from 'react-map-gl';

//components
import { setMapref, setMapboxDrawRef  } from '@/shared/redux/features/mapSlice';
import { useGlobalState } from '@/shared/context/GlobalState';
import  DrawControl  from './components/toolbox/Toolbar'
import { CustomLayers } from './components/layers/CustomLayers';
import { fetchFeatures } from '@/shared/redux/features/featureSlice';
import { FeatureLayer } from './components/layers/FeatureLayer';
import { useSelector } from 'react-redux';
import { useDrawingTool } from '@/shared/map/hooks/useDrawingTool';

export const MapContainer = () => {
    const dispatch = useDispatch()
    
    const INITIAL_POSITION = {
        latitude: -12.020545729298373,
        longitude: -77.0269319335112,
    }
    const ZOOM = 9;
    const mapRef = useRef(null);
    const drawControlRef = useRef(null);

    const {mapType} = useGlobalState()
    const selectedFeature = useSelector(state => state.featureReducer.selectedFeature);
    const { handleDelete, handleEdit, handleSave, handleToolSelection, isEditing } = useDrawingTool();
    
    
    const onLoad = () => {
      dispatch(setMapref(mapRef.current))    
      dispatch(setMapboxDrawRef(drawControlRef.current));
      
      if (mapRef.current){
        mapRef.current.setSprite('https://geosolution.ddns.net/web/pangeaco/sprites/sprite_cto_divicau')
        mapRef.current.setSprite('https://geosolution.ddns.net/web/pangeaco/sprites/sprite_empalme')
        mapRef.current.setSprite('https://geosolution.ddns.net/web/pangeaco/sprites/sprite_site_holder')
      }
    }

    useEffect(()=>{
      dispatch(fetchFeatures()); // carga inicial de features
      if (mapRef.current){
        mapRef.current.setSprite('https://geosolution.ddns.net/web/pangeaco/sprites/sprite_cto_divicau')
        mapRef.current.setSprite('https://geosolution.ddns.net/web/pangeaco/sprites/sprite_empalme')
        mapRef.current.setSprite('https://geosolution.ddns.net/web/pangeaco/sprites/sprite_site_holder')
      }
    },[mapType])


    const onStyleData = (e) => {
      console.log('onStyleData triggered. Map style layers:', mapRef.current?.getStyle().layers);
    };


  const modeChange = (event) => {
    const mapCanvas = mapRef.current.getCanvas();
    switch(event.mode){
      case 'direct_select':
        mapCanvas.classList.remove("cursor-crosshair", "cursor-pointer-icon");
        mapCanvas.classList.add("cursor-pointer-icon");
        break;
      default:
        mapCanvas.classList.remove("cursor-crosshair", "cursor-pointer-icon");
    }
  };
    
  return (
        <Map
            ref={mapRef}    
            onLoad={onLoad}
            onStyleData={onStyleData}
            attributionControl={false}
            initialViewState={{longitude: INITIAL_POSITION.longitude, latitude: INITIAL_POSITION.latitude, zoom: ZOOM}}
            mapLib={mapLibregl}  interactive={true}
            mapStyle={mapType.source}
            style={{width: '100dvw', height: '100dvh'}}
            preserveDrawingBuffer={true}
            interactiveLayerIds={['feature-fill', 'feature-lines', 'feature-point']}
        >  
          <DrawControl ref={drawControlRef} position="top-left" modeChange={modeChange}/>
          <NavigationControl position='top-left' />
          <ScaleControl position='bottom-left' maxWidth={100} unit='metric'/>
          <CustomLayers />
          <FeatureLayer />
        </Map>
  )
}
