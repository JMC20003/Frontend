import { useSelector } from 'react-redux';
import { Source, Layer } from 'react-map-gl';

export const CustomLayers = () => {
  const layerData = useSelector(state => state.mapReducer.layerData);

  // Evita error si no hay datos o no es un array
  if (!Array.isArray(layerData) || layerData.length === 0) return null;

  return (
    <>
      {layerData.map((layer) => (
        <Source
          id="barrios"
          type="vector"
          tiles={[
            "http://localhost:8080/geoserver/gwc/service/tms/1.0.0/geosolution:barrios@EPSG:900913@pbf/{z}/{x}/{y}.pbf"
          ]}
          scheme="tms"
        >
          <Layer
            id="barrios-layer"
            type="fill"
            source="barrios"
            source-layer="barrios" // el nombre de tu capa en GeoServer
            paint={{
              "fill-color": "#ff0000",
              "fill-opacity": 0.5
            }}
          />
        </Source>
      ))}
    </>
  );
};