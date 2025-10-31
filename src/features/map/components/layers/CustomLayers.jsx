import { useSelector } from "react-redux";
import { Source, Layer } from "react-map-gl";
import { FeatureLayer } from "./FeatureLayer";

export const CustomLayers = () => {
  const layerData = useSelector((state) => state.mapReducer.layerData);
  // Si no hay datos de capas base, no renderizamos las capas del geoserver
  if (!layerData?.length) return null;

  return (
    <>
      {layerData.map((layer) => (
        <Source
          key={layer.table}
          id={layer.table}
          type="vector"
          tiles={[
            `${import.meta.env.VITE_URL_GEOSERVER}/gwc/service/tms/1.0.0/${
              import.meta.env.VITE_GEOSERVER_WORKSPACE
            }:${layer.table}@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf`,
          ]}
          scheme="tms"
        >
          {layer.styles?.map((style) => (
            <Layer
              key={style.id}
              id={style.id}
              type={style.type}
              source={layer.table}
              source-layer={style["source-layer"]}
              layout={style.layout}
              paint={style.paint}
              minzoom={style.minzoom}
              maxzoom={style.maxzoom}
            />
          ))}
        </Source>
      ))}
    </>
  );
};
