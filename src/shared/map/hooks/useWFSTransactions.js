export const generateWFSTransaction = (feature, action = "update") => {
    const featureType = "geosolution:barrios";
    const geometryName = "geom";
    const srsName = "EPSG:4326";

    const coords = feature.geometry.coordinates[0]
        .map((c) => c.join(","))
        .join(" ");

    const featureId = feature.properties.nombre; // FID usando nombre

    let xml = `
    <wfs:Transaction service="WFS" version="1.0.0"
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:geosolution="geosolution"
    xmlns:ogc="http://www.opengis.net/ogc">
    `;

    if (action === "insert") {
        xml += `
    <wfs:Insert typeName="${featureType}">
      <geosolution:barrios>
        <geom>
          <gml:Polygon srsName="${srsName}">
            <gml:outerBoundaryIs>
              <gml:LinearRing>
                <gml:coordinates>${coords}</gml:coordinates>
              </gml:LinearRing>
            </gml:outerBoundaryIs>
          </gml:Polygon>
        </geom>
        <nombre>${feature.properties.nombre}</nombre>
        <poblacion>${feature.properties.poblacion || 0}</poblacion>
      </geosolution:barrios>
    </wfs:Insert>`;
    }



    if (action === "update") {
        xml += `
    <wfs:Update typeName="${featureType}">
      <wfs:Property>
        <wfs:Name>${geometryName}</wfs:Name>
        <wfs:Value>
          <gml:Polygon srsName="${srsName}">
            <gml:outerBoundaryIs>
              <gml:LinearRing>
                <gml:coordinates>${coords}</gml:coordinates>
              </gml:LinearRing>
            </gml:outerBoundaryIs>
          </gml:Polygon>
        </wfs:Value>
      </wfs:Property>
      <ogc:Filter>
        <ogc:PropertyIsEqualTo>
          <ogc:PropertyName>nombre</ogc:PropertyName>
          <ogc:Literal>${featureId}</ogc:Literal>
        </ogc:PropertyIsEqualTo>
      </ogc:Filter>
    </wfs:Update>`;
    }

    if (action === "delete") {
        xml += `
    <wfs:Delete typeName="${featureType}">
      <ogc:Filter>
        <ogc:PropertyIsEqualTo>
          <ogc:PropertyName>nombre</ogc:PropertyName>
          <ogc:Literal>${featureId}</ogc:Literal>
        </ogc:PropertyIsEqualTo>
      </ogc:Filter>
    </wfs:Delete>`;
    }

    xml += `\n</wfs:Transaction>`;
    return xml;
};

export const sendTransaction = async (xml) => {
    const res = await fetch("http://localhost:8080/geoserver/geosolution/wfs", {
        method: "POST",
        headers: {
            "Content-Type": "text/xml",
        },
        body: xml,
    });

    const text = await res.text();
    console.log("📡 Respuesta WFS-T:", text);
    return text;
};
