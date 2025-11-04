import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";

import RouteIndex from '@/app/routes/Index';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLayerData } from "@/shared/redux/features/mapSlice";
import { Toaster } from 'sonner';
import { addLayerMetadata } from "../shared/redux/features/mapSlice";

function App() {
  const dispatch = useDispatch();

  const featureLayerMetadata = {
    schema: "Mis Capas", // Categoría para tu FeatureLayer
    table: "barrios", // ID único para esta capa
    styles: [
      { id: "barrios-layer", type: "fill", minzoom: 0, maxzoom: 24 }
    ]
  };


  useEffect(() => {
    dispatch(addLayerMetadata(featureLayerMetadata));
  }, [dispatch]);


  return (
    <>
      <RouteIndex />
      <Toaster />
    </>
  );
}

export default App;
