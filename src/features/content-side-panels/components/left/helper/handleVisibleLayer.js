export const handleVisibleLayer = (layerTable, mapRef, setLayerViewControl, layerData) => {
  const layer = layerData.find(l => l.table === layerTable);
  if (!layer) return;

  const map = mapRef?.getMap();
  if (!map) return;

  const isVisible = map.getLayoutProperty(layer.styles[0].id, 'visibility') === 'visible';
  const newVisibility = isVisible ? 'none' : 'visible';

  layer.styles.forEach(style => {
    if (map.getLayer(style.id)) {
      map.setLayoutProperty(style.id, 'visibility', newVisibility);
    }
  });

  // Podés usar esto para actualizar estado de UI si querés
  setLayerViewControl(prev => {
  const updated = {
    displayed: prev.displayed.filter(layer => layer !== layerTable),
    hidden: prev.hidden.filter(layer => layer !== layerTable),
  };

  if (newVisibility === 'visible') {
    updated.displayed.push(layerTable);
  } else {
    updated.hidden.push(layerTable);
  }

  return updated;
});
};