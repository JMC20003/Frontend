import axios from "axios";

const GEOSERVER_URL = import.meta.env.VITE_URL_GEOSERVER;

export const getGeoserverLayers = async () => {
  try {
    const response = await axios.get(`${GEOSERVER_URL}/rest/layers.json`, {
      auth: {
        username: import.meta.env.VITE_GEOSERVER_USER,
        password: import.meta.env.VITE_GEOSERVER_PASSWORD,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Capas obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo capas:", error.message);
    console.log(error.response?.data);
    return null;
  }
};
