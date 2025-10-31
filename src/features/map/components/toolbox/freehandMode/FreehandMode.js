import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from "@turf/turf";

const FreehandMode = Object.assign({}, MapboxDraw.modes.draw_polygon);

FreehandMode.onSetup = function() {
    const polygon = this.newFeature({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[]]
        }
    });

    this.addFeature(polygon);
    this.clearSelectedFeatures();
    
    setTimeout(() => {
        if (!this.map || !this.map.dragPan) return;
        this.map.dragPan.disable();
    }, 0);

    this.updateUIClasses({ mouse: 'add' });
    this.activateUIButton('polygon');
    this.setActionableState({
        trash: true
    });

    return {
        polygon,
        currentVertexPosition: 0,
        dragMoving: false
    };
};

FreehandMode.onDrag = FreehandMode.onTouchMove = function (state, e){
    state.dragMoving = true;
    this.updateUIClasses({ mouse: 'add' });
    state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
    state.currentVertexPosition++;
    state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
};

FreehandMode.onMouseUp = function (state, e){
    if (state.dragMoving) {
        this.simplify(state.polygon);
        this.fireUpdate(state);
        this.changeMode('simple_select', { featureIds: [state.polygon.id] });
    }
};

FreehandMode.onTouchEnd = function(state, e) {
    this.onMouseUp(state, e);
};

FreehandMode.fireUpdate = function(state) {
    this.map.fire('draw.update', {
        action: 'move',
        features: this.getSelected().map(f => f.toGeoJSON())
    });
    this.map.fire("draw.create", {
    features: [state.polygon.toGeoJSON()]
    });
};

FreehandMode.simplify = function(polygon) {
  const tolerance = 0.00000001 / Math.pow(1.05, 10 * this.map.getZoom());
  turf.simplify(polygon, {
      mutate: true,
      tolerance: tolerance,
      highQuality: true
  });
};

FreehandMode.onStop = function () {
  setTimeout(() => {
    if (!this.map || !this.map.dragPan) return;
    this.map.dragPan.enable();
  }, 0);
};
  
export default FreehandMode;