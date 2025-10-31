import { useEffect, useRef, useState } from 'react'
import { useGlobalState } from '@/shared/context/GlobalState';
import { useSelector } from 'react-redux';
import { filterSelectedByLayer } from '../helper/filterSelectedByLayer';

const useTableContent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('');
    const [dataTable, setDataTable] = useState([]);
    const [ columns, setColumns ] = useState([])


    const mapRef = useSelector((state) => state.mapReducer.mapRef);
    const currentLayerRef = useRef(null);

    const {layersTableDown, selectView} = useGlobalState();

    useEffect(() => {
        if (selectView === "selec") {
        const firstLayerName = Object.keys(layersTableDown || {})[0] || null;
        const filtered = filterSelectedByLayer([], activeTab, firstLayerName, activeTab);
        
        setDataTable(filtered);
        if (filtered.length) {
            setColumns(Object.keys(filtered[0].properties));
        }
    }
    }, [selectView]);



    useEffect(() => {
    const keys = Object.keys(layersTableDown || {});
    if (keys.length && !activeTab) setActiveTab(keys[0]);
    if (!keys.includes(activeTab)) setActiveTab(keys[0] || null);
    }, [layersTableDown]);

    useEffect(() => {
    if(selectView === "selec") return
    if (!Object.keys(layersTableDown).length || !mapRef) {
      setDataTable(null);
      currentLayerRef.current = null;
      return;
    }

    const map = mapRef.getMap();

    const getFeaturesOnZoom = () => {
      const dataLayer = [];
      const features = map.queryRenderedFeatures();
      const currentLayer = layersTableDown[activeTab];
      
      features?.forEach((layer) => {
        if (!currentLayer) return;
        if (
          layer.layer.id === currentLayer?.styles[0].id
        ) {
          dataLayer.push(layer);
        }
      });

      setDataTable(dataLayer);
      setColumns(dataLayer[0]?._vectorTileFeature?._keys || []);
      currentLayerRef.current = layersTableDown;
    };

    if (currentLayerRef.current !== layersTableDown[activeTab]) {
      getFeaturesOnZoom();
    }

    map.on("moveend", getFeaturesOnZoom);
    return () => map.off("moveend", getFeaturesOnZoom);
  }, [layersTableDown, activeTab, selectView]);




  return {
    dataTable,
    activeTab,
    setActiveTab,
    columns,
    selectView,
    currentPage, setCurrentPage
  }
}

export default useTableContent