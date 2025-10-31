import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFeatures,
  createFeatureCollection,
  getFeatureById,
  updateFeature,
  deleteFeature
} from "@/features/map/services/featureAPI";

// Estado inicial
const initialState = {
  features: {
    type: "FeatureCollection",
    features: [],
  },
  selectedFeature: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchFeatures = createAsyncThunk(
  "features/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeatures();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addFeatureCollection = createAsyncThunk(
  "features/addCollection",
  async (featureCollection, { rejectWithValue }) => {
    try {
      const data = await createFeatureCollection(featureCollection);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFeatureById = createAsyncThunk(
  "features/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getFeatureById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editFeature = createAsyncThunk(
  "features/update",
  async ({ id, feature }, { rejectWithValue }) => {
    try {
      const data = await updateFeature(id, feature);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFeature = createAsyncThunk(
  "features/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFeature(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice principal
const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    setSelectedFeature: (state, action) => {
      console.log('featureSlice: setSelectedFeature payload:', action.payload);
      state.selectedFeature = action.payload;
    },
    clearSelectedFeature: (state) => {
      state.selectedFeature = null;
    },
    //preguntar como funciona esto
    updateSelectedFeatureStyle: (state, action) => {
      const { featureId, newStyle } = action.payload;
      if (state.selectedFeature && String(state.selectedFeature.id) === String(featureId)) {
        state.selectedFeature.properties = { ...state.selectedFeature.properties, ...newStyle };
      }
      // También actualizar la feature en el array principal si es necesario
      const index = state.features.features.findIndex(f => String(f.id) === String(featureId));
      if (index !== -1) {
        state.features.features[index].properties = { ...state.features.features[index].properties, ...newStyle };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFeatureCollection.fulfilled, (state, action) => {
        if (action.payload && action.payload.type === 'FeatureCollection') {
          state.features.features.push(...action.payload.features);
        }
      })
      // UPDATE
      .addCase(editFeature.fulfilled, (state, action) => {
        const index = state.features.features.findIndex(f => f.id === action.payload.id);
        if (index !== -1) state.features.features[index] = action.payload;
      })
      // DELETE
      .addCase(removeFeature.fulfilled, (state, action) => {
        state.features.features = state.features.features.filter(f => f.id !== action.payload);
      })
      // GET BY ID
      .addCase(fetchFeatureById.fulfilled, (state, action) => {
        state.selectedFeature = action.payload;
      });
  },
});

// Exportar acciones y reducer
export const { setSelectedFeature, clearSelectedFeature,updateSelectedFeatureStyle } = featuresSlice.actions;
export default featuresSlice.reducer;
