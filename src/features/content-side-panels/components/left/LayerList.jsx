import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { handleVisibleLayer } from "./helper/handleVisibleLayer";
import { toggleLayerEntry } from "./helper/toggleLayerEntry";
import { useGlobalState } from "@/shared/context/GlobalState";
import LayerCategory from "./components/LayerCategory";
import { getLayerVisibility } from "./helper/getLayerVisibility";

export const LayerList = () => {
  const mapRef = useSelector((s) => s.mapReducer.mapRef);
  const layerData = useSelector((s) => s.mapReducer.layerData);
  const [currentZoom, setCurrentZoom] = useState(null);
  const [orderedLayers, setOrderedLayers] = useState([]);
  const { 
    setLayerViewControl, setLayerActiveGeoserver, layerActiveGeoserver, 
    setLayersTableDown
  } = useGlobalState();

  const grouped = useMemo(() => {
    return orderedLayers.reduce((acc, layer) => {
      acc[layer.schema] = acc[layer.schema] || [];
      acc[layer.schema].push(layer);
      return acc;
    }, {});
  }, [orderedLayers]);

  const [expandedCats, setExpandedCats] = useState({});

  useEffect(() => {
    if (!mapRef) return;
    const handleZoom = () => setCurrentZoom(mapRef.getZoom());
    mapRef.on("zoom", handleZoom);
    return () => mapRef.off("zoom", handleZoom);
  }, [mapRef]);

  useEffect(() => {
    if (layerData && JSON.stringify(layerData) !== JSON.stringify(orderedLayers)) {
      setOrderedLayers([...layerData]);
    }
  }, [layerData]);


  const toggleLayer = (layerId) => {
    handleVisibleLayer(layerId, mapRef, setLayerViewControl, layerData);
  };

  const toggleCategoryLayers = (category, layers) => {
    if (!mapRef) return;
    const allActive = layers.every((l) => getLayerVisibility(l.styles?.[0]?.id, mapRef));
    const shouldShow = !allActive;
    layers.forEach((layer) => {
      const styleId = layer.styles?.[0]?.id;
      if (!styleId) return;
      const isVisible = getLayerVisibility(styleId, mapRef);
      if (isVisible !== shouldShow)
        handleVisibleLayer(layer.table, mapRef, setLayerViewControl, layerData);
    });
  };

  const handleSelectLayer = (layer) => {
    const isVisible = getLayerVisibility(layer.styles[0].id, mapRef);
    if (!isVisible) return;
    setLayerActiveGeoserver((prev) => toggleLayerEntry(prev, layer));
  };

  const selectLayerTableDown = (layer) => {
    const isVisible = getLayerVisibility(layer.styles[0].id, mapRef);
    if (!isVisible) return;
    setLayersTableDown((prev) => toggleLayerEntry(prev, layer));
  }

  const toggleExpand = (category) => {
    setExpandedCats((prev) => ({
      ...prev,
      [category]: !(prev[category] ?? false),
    }));
  };

  return (
    <div className="p-2 w-full h-[60dvh] overflow-y-auto custom-scrollbar">
      {Object.entries(grouped).map(([category, layers]) => (
        <LayerCategory
          key={category}
          category={category}
          layers={layers}
          currentZoom={currentZoom}
          expanded={expandedCats[category] ?? false}
          toggleExpand={toggleExpand}
          toggleCategoryLayers={toggleCategoryLayers}
          handleSelectLayer={handleSelectLayer}
          toggleLayer={toggleLayer}
          layerActiveGeoserver={layerActiveGeoserver}
          setOrderedLayers={setOrderedLayers}
          selectLayerTableDown={selectLayerTableDown}
        />
      ))}
    </div>
  );
};

