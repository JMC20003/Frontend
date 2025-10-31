export const changeLayerColor = (map, layer, newColor) => {
  if (!map || !layer || !layer.styles) return;

  layer.styles.forEach(style => {
    if (!map.getLayer(style.id)) return;

    // Determine which paint property to change based on layer type
    let colorProperty;
    let opacityProperty;
    switch (style.type) {
      case 'fill':
        colorProperty = 'fill-color';
        opacityProperty = 'fill-opacity';
        break;
      case 'line':
        colorProperty = 'line-color';
        break;
      case 'symbol':
        // For symbols, it could be text-color or icon-color.
        // We'll check for text-color first as it's more common for this kind of styling.
        if (map.getPaintProperty(style.id, 'text-color')) {
          colorProperty = 'text-color';
          opacityProperty = 'text-opacity';
        
        }
        break;
      default:
        return; // Skip if layer type doesn't have a color property we handle
    }

    if (colorProperty) {
      map.setPaintProperty(style.id, colorProperty, newColor);
      if (opacityProperty) {
      map.setPaintProperty(style.id, opacityProperty, 0.1);
      }
    }
  });
};