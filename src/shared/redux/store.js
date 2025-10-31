import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "@/shared/redux/features/mapSlice"
import featureReducer from "@/shared/redux/features/featureSlice"
export const store = configureStore({
  reducer: {
    mapReducer,
    featureReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});