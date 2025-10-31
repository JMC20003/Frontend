// src/shared/map/tools/setDrawMode.js

export const setDrawMode = (mapRef, drawRef, mode) => {
  if (!drawRef || !mapRef) return;

  const mapCanvas = mapRef.getCanvas();
  drawRef.changeMode(mode);

  mapCanvas.classList.remove("cursor-default", "cursor-crosshair", "cursor-pointer");
  mapCanvas.classList.add("cursor-crosshair");
};
