 export const getLayerVisibility = (layerId,mapRef) => {
    const map = mapRef?.getMap();
    if (!map || !map.getLayer(layerId)) return false;
    return map.getLayoutProperty(layerId, "visibility") === "visible";
  };