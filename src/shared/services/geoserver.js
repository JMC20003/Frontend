import axios from 'axios'

const GEOSERVER_URL = import.meta.env.VITE_URL_GEOSERVER
const WORKSPACE = import.meta.env.VITE_GEOSERVER_WORKSPACE
const CRS = "EPSG:4326"


export const getCompleteGeometry = async (layerID,CQL_FILTER) => {
        try {
            const wfsUrl = `${GEOSERVER_URL}/${WORKSPACE}/ows`
            
            const params = {
                service: 'WFS',
                version: '1.0.0',
                request: 'GetFeature',
                typeNames: `${WORKSPACE}:${layerID}`,
                outputFormat: 'application/json',
                CQL_FILTER: `${CQL_FILTER}`,
                srsName: CRS
            }

            const response = await axios.get(wfsUrl, { params })
            
            if(response.data?.features?.length > 0) {
                return response.data.features[0]
            }
            return null
            
        } catch (error) {
            console.error("Error fetching WFS:", error)
            return null
        }
    }


const convertCoordinates = (coordinates, geometryType) => {
    // Aplanar coordenadas para LineString y Polygon
    if (geometryType === 'LineString') {
        return coordinates.map(coord => [coord[0], coord[1]]);
    }
    if (geometryType === 'Polygon') {
        return coordinates.map(coord => [coord[0], coord[1]])
    }
    return coordinates;
};

export const getIntersectingFeatures = async (layerID, drawnGeometry, geomField = 'geom') => {
    try {
        const wfsUrl = `${GEOSERVER_URL}/${WORKSPACE}/ows`;
        
        // Validar layerID
        if (!layerID || (Array.isArray(layerID) && layerID.length === 0)) {
            throw new Error('LayerID no especificado');
        }

        // Convertir geometría a WKT correctamente
        const geometryType = drawnGeometry.geometry.type.toUpperCase();
        let coordinates = drawnGeometry.geometry.coordinates;
        let wktGeometry;

        switch (geometryType) {
            case 'POLYGON':
                coordinates = coordinates[0];
                wktGeometry = `POLYGON((${convertCoordinates(coordinates, 'Polygon')
                    .map(coord => coord.join(' '))
                    .join(', ')}))`;
                break;
            
            case 'LINESTRING':
                wktGeometry = `LINESTRING(${convertCoordinates(coordinates, 'LineString')
                    .map(coord => coord.join(' '))
                    .join(', ')})`;
                break;
            
            default:
                throw new Error(`Tipo de geometría no soportado: ${geometryType}`);
        }


        const cqlFilters = `INTERSECTS(${geomField}, ${wktGeometry})`

        
        const params = {
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typeName: layerID,
            CQL_FILTER: cqlFilters,
            outputFormat: 'application/json',
            maxFeatures: 1000
        };


        const wfsGetFeatureUrl = `${wfsUrl}?${new URLSearchParams(params)}`;
        const response = await axios.get(wfsGetFeatureUrl);

        return response.data?.features || [];

    } catch (error) {
        console.error("Error en consulta WFS:", {
            config: error.config,
            response: error.response?.data,
            message: error.message
        });
        return [];
    }
};