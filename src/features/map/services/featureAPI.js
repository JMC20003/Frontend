import { http } from '@/shared/services/api';

//aqui se puede agregar funcionalidad para manejo de errores , try cathch, etc
export const getFeatures = async () => {
    const response = await http.get('/features');
    return response.data;
};

export const createFeatureCollection = async (featureCollection) => {
   const response = await http.post('/feature/collection', featureCollection);
   return response.data;
};

export const getFeatureById = async(id) => {
  const response = await http.get(`/feature/${id}`);
  console.log(`API: getFeatureById(${id}) response:`, response);
  console.log(`API: getFeatureById(${id}) response.data:`, response.data);
  return response.data;
};

export const updateFeature = async(id, feature) => {
  const response = await http.put(`/feature/${id}`, feature);
  return response.data;
};

export const deleteFeature = async(id) => {
  const response = await http.delete(`/feature/${id}`);
  return response.data;
};