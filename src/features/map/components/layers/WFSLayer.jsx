import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";
import { generateWFSTransaction,sendTransaction } from "../../../../shared/map/hooks/useWFSTransactions";

export const WFSLayer = ({ drawControlRef }) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map || !drawControlRef?.current) return;
    const draw = drawControlRef.current;

    const wfsUrl =
      "http://localhost:8080/geoserver/geosolution/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geosolution:barrios&outputFormat=application/json&srsName=EPSG:4326";

    // Cargar geometrías desde GeoServer
    fetch(wfsUrl)
      .then((res) => res.json())
      .then((geojson) => {
        draw.deleteAll();
        geojson.features.forEach((f) => draw.add(f));
      });

    // Listener: Crear geometría
    map.on("draw.create", async (e) => {
      const feature = e.features[0];
      const xml = generateWFSTransaction(feature, "insert");
      const response = await sendTransaction(xml);
      console.log("Insert WFS-T Response:", response);
    });

    // Listener: Editar geometría
    map.on("draw.update", async (e) => {
      const feature = e.features[0];
      const xml = generateWFSTransaction(feature, "update");
      const response = await sendTransaction(xml);
      console.log("Update WFS-T Response:", response);
    });

    // Listener: Eliminar geometría
    map.on("draw.delete", async (e) => {
      const feature = e.features[0];
      const xml = generateWFSTransaction(feature, "delete");
      const response = await sendTransaction(xml);
      console.log("Delete WFS-T Response:", response);
    });

    return () => {
      map.off("draw.create");
      map.off("draw.update");
      map.off("draw.delete");
    };
  }, [map, drawControlRef]);

  return null;
};
