import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mapBoxDrawStateRef: null,
  mapRef: null,
  layerData: [], // Aseguramos que sea un array
  activeDrawMode: null,
};

export const map_slice = createSlice({
  name: "map_slice",
  initialState,
  reducers: {
    setMapboxDrawRef: (state, action) => {
      state.mapBoxDrawStateRef = action.payload;
    },
    setMapref: (state, action) => {
      state.mapRef = action.payload;
    },
    setLayerData: (state, action) => {
      state.layerData = action.payload;
    },
    setActiveDrawMode: (state, action) => {
      state.activeDrawMode = action.payload;
    },
    addLayerMetadata: (state, action) => {
      // Asegurarse de que no se añadan duplicados si ya existe por 'table' 
      if (!state.layerData.some(layer => layer.table === action.payload.table))
        state.layerData.push(action.payload);
    },
    removeLayerMetadata: (state, action) => {
      state.layerData = state.layerData.filter(layer => layer.table !== action.payload.table);
    },
  }
});


export const {
  setMapboxDrawRef,
  setMapref,
  setLayerData,
  setActiveDrawMode,
  addLayerMetadata,
  removeLayerMetadata
} = map_slice.actions;

export default map_slice.reducer;