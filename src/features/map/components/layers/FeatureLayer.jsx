import { Source, Layer } from "react-map-gl/maplibre";
import { useSelector } from "react-redux";
import { useMemo } from "react";

export const FeatureLayer = () => {
  const { features, selectedFeature } = useSelector((state) => state.featureReducer);

  if (!features || !features.features || features.features.length === 0) {
    return null;
  }

  const geojson = features;

  // Extraer todos los patrones únicos de line-dasharray
  const uniqueDashPatterns = useMemo(() => {
    const patterns = new Map();

    geojson.features.forEach((feature, index) => {
      const dashArray = feature.properties?.['line-dasharray'];
      if (dashArray && Array.isArray(dashArray) && dashArray.length > 0) {
        const key = JSON.stringify(dashArray);
        if (!patterns.has(key)) {
          patterns.set(key, {
            pattern: dashArray,
            id: `dash-${index}` // ID único
          });
        }
      }
    });

    return Array.from(patterns.values());
  }, [geojson]);

  return (
    <>
      <Source id="feature-source" type="geojson" data={geojson}>
        {/* Fill layer para polígonos */}
        <Layer
          id="feature-fill"
          type="fill"
          filter={['==', '$type', 'Polygon']}
          paint={{
            'fill-color': ['coalesce', ['get', 'fill-color'], '#007cbf'],
            'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.5],
          }}
        />

        {/* Line layer - solid (sin dasharray) */}
        <Layer
          id="feature-lines-solid"
          type="line"
          filter={[
            'any',
            ['!', ['has', 'line-dasharray']],
            ['==', ['get', 'line-dasharray'], null]
          ]}
          paint={{
            'line-color': ['coalesce', ['get', 'line-color'], '#007cbf'],
            'line-width': ['coalesce', ['get', 'line-width'], 2],
          }}
        />

        {/* Generar un layer por cada patrón de dasharray único */}
        {uniqueDashPatterns.map(({ pattern, id }) => (
          <Layer
            key={`feature-lines-${id}`}
            id={`feature-lines-${id}`}
            type="line"
            filter={[
              'all',
              ['has', 'line-dasharray'],
              // Comparar cada elemento del array
              ...pattern.map((value, idx) => [
                '==',
                ['at', idx, ['get', 'line-dasharray']],
                value
              ])
            ]}
            paint={{
              'line-color': ['coalesce', ['get', 'line-color'], '#007cbf'],
              'line-width': ['coalesce', ['get', 'line-width'], 2],
              'line-dasharray': pattern
            }}
          />
        ))}

        {/* Point layer */}
        <Layer
          id="feature-points"
          type="circle"
          paint={{
            'circle-radius': ['coalesce', ['get', 'circle-radius'], 4],
            'circle-color': ['coalesce', ['get', 'circle-color'], '#007cbf'],
          }}
        />
      </Source>

      {selectedFeature && (
        <Source
          id="selected-backend-feature"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [selectedFeature],
          }}
        >
          <Layer
            id="selected-backend-feature-fill"
            type="fill"
            filter={['==', '$type', 'Polygon']}
            paint={{
              'fill-color': selectedFeature.properties?.['fill-color'] ?? '#d8904dff',
              'fill-opacity': selectedFeature.properties?.['fill-opacity'] ?? 0.7,
            }}
          />

          <Layer
            id="selected-backend-feature-line"
            type="line"
            filter={['any', ['==', '$type', 'LineString'], ['==', '$type', 'Polygon']]}
            paint={{
              'line-color': selectedFeature.properties?.['line-color'] ?? '#d8904dff',
              'line-width': (selectedFeature.properties?.['line-width'] ?? 2) + 3,
              'line-dasharray': selectedFeature.properties?.['line-dasharray'] ?? [1, 0]
            }}
          />

          <Layer
            id="selected-backend-feature-point"
            type="circle"
            filter={['==', '$type', 'Point']}
            paint={{
              'circle-radius': (selectedFeature.properties?.['circle-radius'] ?? 4) + 2,
              'circle-color': selectedFeature.properties?.['circle-color'] ?? '#d8904dff',
            }}
          />
        </Source>
      )}
    </>
  );
}