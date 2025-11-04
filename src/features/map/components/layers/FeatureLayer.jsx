import { Source, Layer } from "react-map-gl/maplibre";
import { useSelector } from "react-redux";
import { useMemo } from "react";

export const FeatureLayer = () => {
  const { features, selectedFeature } = useSelector(
    (state) => state.featureReducer
  );

  const geojson = features;

  // useMemo siempre se llama
  const uniqueDashPatterns = useMemo(() => {
    const featuresArray = geojson?.features;
    if (!featuresArray || !Array.isArray(featuresArray)) return [];

    const patterns = new Map();
    featuresArray.forEach((feature, index) => {
      const dashArray = feature.properties?.['line-dasharray'];
      if (dashArray && Array.isArray(dashArray) && dashArray.length > 0) {
        const key = JSON.stringify(dashArray);
        if (!patterns.has(key)) {
          patterns.set(key, { pattern: dashArray, id: `dash-${index}` });
        }
      }
    });

    return Array.from(patterns.values());
  }, [geojson]);

  // ahora sí, si no hay features, retornamos null
  if (!features || !features.features || features.features.length === 0) {
    return null;
  }

  
  try {
    return (
      <>
        {/* 🔹 Fuente principal (tus features desde backend) */}
        <Source id="feature-source" type="geojson" data={geojson}>
          <Layer
            id="feature-fill"
            type="fill"
            filter={["==", "$type", "Polygon"]}
            layout={{}}
            paint={{
              "fill-color": ["coalesce", ["get", "fill-color"], "#007cbf"],
              "fill-opacity": ["coalesce", ["get", "fill-opacity"], 0.5],
            }}
          />

          <Layer
            id="feature-lines-solid"
            type="line"
            filter={[
              "any",
              ["!", ["has", "line-dasharray"]],
              ["==", ["get", "line-dasharray"], null],
            ]}
            layout={{}}
            paint={{
              "line-color": ["coalesce", ["get", "line-color"], "#007cbf"],
              "line-width": ["coalesce", ["get", "line-width"], 2],
            }}
          />

          {uniqueDashPatterns.map(({ pattern, id }) => (
            <Layer
              key={id}
              id={`feature-lines-${id}`}
              type="line"
              filter={[
                "all",
                ["has", "line-dasharray"],
                ...pattern.map((value, idx) => [
                  "==",
                  ["at", idx, ["get", "line-dasharray"]],
                  value,
                ]),
              ]}
              layout={{}}
              paint={{
                "line-color": ["coalesce", ["get", "line-color"], "#007cbf"],
                "line-width": ["coalesce", ["get", "line-width"], 2],
                "line-dasharray": pattern,
              }}
            />
          ))}

          <Layer
            id="feature-points"
            type="circle"
            filter={["==", "$type", "Point"]}
            layout={{}}
            paint={{
              "circle-radius": ["coalesce", ["get", "circle-radius"], 4],
              "circle-color": ["coalesce", ["get", "circle-color"], "#007cbf"],
            }}
          />
        </Source>

        {/* 🔹 Capa destacada (feature seleccionada) */}
        {selectedFeature && (
          <Source
            id="selected-feature-source"
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: [selectedFeature],
            }}
          >
            <Layer
              id="selected-feature-fill"
              type="fill"
              filter={["==", "$type", "Polygon"]}
              layout={{}}
              paint={{
                "fill-color": "#d8904dff",
                "fill-opacity": 0,
              }}
            />

            <Layer
              id="selected-feature-line"
              type="line"
              filter={[
                "any",
                ["==", "$type", "LineString"],
                ["==", "$type", "Polygon"],
              ]}
              layout={{}}
              paint={{
                "line-color":"#d8904dff",
                "line-width": 2,
              }}
            />

            <Layer
              id="selected-feature-point"
              type="circle"
              layout={{}}
              paint={{
                "circle-radius": 5,
                "circle-color": "#d8904dff",
              }}
            />
          </Source>
        )}
      </>
    );
  } catch (error) {
    console.error("Error al renderizar capas:", error);
    return null;
  }
};
