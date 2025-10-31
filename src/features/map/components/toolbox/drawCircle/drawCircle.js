import * as turf from "@turf/turf";

// Manejo del zoom por doble clic
const handleDoubleClickZoom = {
  enable(ctx) {
    setTimeout(() => {
      if (ctx?.map?.doubleClickZoomCircle && ctx._ctx?.store) {
        const initConfig = ctx._ctx.store.getInitialConfigValue;
        if (initConfig?.("doubleClickZoomCircle")) {
          ctx.map.doubleClickZoomCircle.enable();
        }
      }
    }, 0);
  },
  disable(ctx) {
    setTimeout(() => {
      if (ctx?.map?.doubleClickZoomCircle) {
        ctx.map.doubleClickZoomCircle.disable();
      }
    }, 0);
  }
};

// Modo para arrastrar y crear círculos personalizados
const DragCircleCustomMode = {
  onSetup() {
    const polygon = this.newFeature({
      type: "Feature",
      properties: {
        isCircle: true,
        center: []
      },
      geometry: {
        type: "Polygon",
        coordinates: []
      }
    });

    this.addFeature(polygon);
    handleDoubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: "pointer" });
    this.setActionableState({ trash: true });

    return { polygon, currentVertexPosition: 0 };
  },

  onMouseMove(state, e) {
    const center = state.polygon.properties.center;
    if (center.length === 0) {
      return;
    }

    const distance = turf.distance(
      turf.point(center),
      turf.point([e.lngLat.lng, e.lngLat.lat]),
      { units: 'kilometers' }
    );

    const circle = turf.circle(center, distance, { steps: 170 });
    state.polygon.incomingCoords(circle.geometry.coordinates);
    state.polygon.properties.radiusInKm = distance;
  },

  onStop(state) {
    handleDoubleClickZoom.enable(this);

    if (state.polygon.isValid()) {
      this.map.fire("draw.create", {
        features: [state.polygon.toGeoJSON()]
      });
    } else {
      this.deleteFeature([state.polygon.id], { silent: true });
      this.changeMode("simple_select", {}, { silent: true });
    }
  },

  onClick(state, e) {
    const currentCenter = state.polygon.properties.center;

    if (currentCenter.length === 0) {
      state.polygon.properties.center = [e.lngLat.lng, e.lngLat.lat];
    } else {
      this.changeMode("simple_select", { featureIds: [state.polygon.id] });
    }
  },

  toDisplayFeatures(state, geojson, display) {
    const isActive = geojson.properties.id === state.polygon.id;
    geojson.properties.active = isActive ? "true" : "false";
    display(geojson);
  }
};

export default DragCircleCustomMode;
