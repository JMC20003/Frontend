import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";

import RouteIndex from '@/app/routes/Index'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLayerData, addLayerMetadata } from "@/shared/redux/features/mapSlice";
import { getAllTables } from "@/shared/services/tableServices";
import { Toaster } from 'sonner'; // Importar Toaster

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();

  const featureLayerMetadata = {
    schema: "Mis Capas", // Categoría para tu FeatureLayer
    table: "feature-layer-data", // ID único para esta capa
    styles: [
      { id: "feature-fill", type: "fill", minzoom: 0, maxzoom: 24 },
      { id: "feature-lines-solid", type: "line", minzoom: 0, maxzoom: 24 },
      { id: "feature-points", type: "circle", minzoom: 0, maxzoom: 24 } // Ajusta el tipo si no son símbolos
    ]
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllTables();
        if (data && data.data) {
          dispatch(setLayerData(data.data));
        } else {
          console.warn('App.jsx: getAllTables returned no data or data.data is empty.', data);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        console.log('App.jsx: FeatureLayer metadata:', featureLayerMetadata);
        dispatch(addLayerMetadata(featureLayerMetadata)); // Ejecutar incondicionalmente
        setIsLoading(true);
      }
    };
    load();
  }, []);
  if (!isLoading) {
    return <></>
  }

  return (
    <>
      <RouteIndex />
      <Toaster /> {/* Renderizar Toaster aquí */}
    </>
  )
}

export default App
