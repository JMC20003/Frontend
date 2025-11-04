import { useState, useMemo, useEffect } from "react";
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
  const [expandedCats, setExpandedCats] = useState({});

  const {
    setLayerViewControl,
    setLayerActiveGeoserver,
    layerActiveGeoserver,
    setLayersTableDown,
  } = useGlobalState();

  // Agrupar por schema
  const grouped = useMemo(() => {
    if (!Array.isArray(orderedLayers)) return {};
    return orderedLayers.reduce((acc, layer) => {
      if (!layer?.schema) return acc;
      acc[layer.schema] = acc[layer.schema] || [];
      acc[layer.schema].push(layer);
      return acc;
    }, {});
  }, [orderedLayers]);

  // Sincronizar zoom
  useEffect(() => {
    if (!mapRef) return;
    const handleZoom = () => setCurrentZoom(mapRef.getZoom());
    mapRef.on("zoom", handleZoom);
    return () => mapRef.off("zoom", handleZoom);
  }, [mapRef]);

  // Sincronizar datos
  useEffect(() => {
    if (Array.isArray(layerData) && JSON.stringify(layerData) !== JSON.stringify(orderedLayers)) {
      setOrderedLayers([...layerData]);
    }
  }, [layerData]);

  // Toggle individual
  const toggleLayer = (layerId) => {
    if (!layerId || !mapRef) return;
    handleVisibleLayer(layerId, mapRef, setLayerViewControl, layerData);
  };

  // Toggle categoría completa
  const toggleCategoryLayers = (category, layers) => {
    if (!mapRef || !Array.isArray(layers)) return;
    const allActive = layers.every((l) => {
      const styleId = l?.styles?.[0]?.id;
      return styleId ? getLayerVisibility(styleId, mapRef) : false;
    });
    const shouldShow = !allActive;

    layers.forEach((layer) => {
      const styleId = layer?.styles?.[0]?.id;
      if (!styleId) return;
      const isVisible = getLayerVisibility(styleId, mapRef);
      if (isVisible !== shouldShow) {
        handleVisibleLayer(layer.table, mapRef, setLayerViewControl, layerData);
      }
    });
  };

  // Selección de capa activa
  const handleSelectLayer = (layer) => {
    const styleId = layer?.styles?.[0]?.id;
    if (!styleId || !mapRef) return;
    const isVisible = getLayerVisibility(styleId, mapRef);
    if (!isVisible) return;
    setLayerActiveGeoserver((prev) => toggleLayerEntry(prev, layer));
  };

  // Selección para tabla inferior
  const selectLayerTableDown = (layer) => {
    const styleId = layer?.styles?.[0]?.id;
    if (!styleId || !mapRef) return;
    const isVisible = getLayerVisibility(styleId, mapRef);
    if (!isVisible) return;
    setLayersTableDown((prev) => toggleLayerEntry(prev, layer));
  };

  // Expandir / contraer categorías
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
