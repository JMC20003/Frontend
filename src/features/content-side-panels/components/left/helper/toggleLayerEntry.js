export function toggleLayerEntry(state, layer) {
  const newState = { ...state };

  const isActive = Boolean(newState[layer.table]);

  if (isActive) {
    delete newState[layer.table];
  } else {
    const layerCount = Object.keys(newState).length;
    if (layerCount >= 5) {
      console.warn("Máximo de 5 capas activas alcanzado.");
      return state; // No modifica el estado actual
    }
    newState[layer.table] = layer;
  }

  return newState;
}
