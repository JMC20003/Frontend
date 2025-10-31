export const filterSelectedByLayer = (features, capaName, firstLayerName, firstTabName) => 
  features.filter(f => {
    if (!f.id) {
      return capaName === firstLayerName && capaName === firstTabName;
    }
    return String(f.id).startsWith(`${capaName}.`);
  });