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
      console.log('mapSlice: Storing mapRef payload:', action.payload);
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
      if (!state.layerData.some(layer => layer.table === action.payload.table)) {
        state.layerData.push(action.payload);
        console.log('mapSlice: Layer added. New layerData:', state.layerData);
      } else {
        console.log('mapSlice: Layer already exists, not adding.', action.payload.table);
      }
    },
  }
});


export const {
  setMapboxDrawRef,
  setMapref,
  setLayerData,
  setActiveDrawMode,
  addLayerMetadata
} = map_slice.actions;

export default map_slice.reducer;