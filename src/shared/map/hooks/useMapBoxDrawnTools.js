import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  setSelectedFeature,
  clearSelectedFeature,
} from "@/shared/redux/features/featureSlice";
import { generateWFSTransaction, sendTransaction } from "./useWFSTransactions";

export const useDrawingTool = (drawRef) => {
  const dispatch = useDispatch();
  const selectedFeature = useSelector((state) => state.featureReducer.selectedFeature);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Cargar feature seleccionado desde el mapa (Vector Tile o WFS)
  const handleSelectFeature = useCallback(
    (feature) => {
      if (!feature || !feature.geometry) {
        toast.error("El feature seleccionado no es válido.");
        return;
      }

      dispatch(setSelectedFeature(feature));
      toast.success("Feature seleccionado correctamente.");
    },
    [dispatch]
  );

  // ✅ Iniciar edición
  const handleEdit = useCallback(() => {
    if (!selectedFeature) {
      toast.error("Selecciona primero un feature.");
      return;
    }
    if (!drawRef?.current) {
      toast.error("Mapbox Draw no está listo.");
      return;
    }

    try {
      setIsEditing(true);
      const draw = drawRef.current;

      draw.deleteAll();
      draw.add(selectedFeature);

      const featureId = selectedFeature.id || selectedFeature.properties?.id;
      toast.success(`Editando feature ID: ${featureId}`);
    } catch (err) {
      console.error("Error al preparar feature para edición:", err);
      toast.error("No se pudo iniciar la edición.");
    }
  }, [selectedFeature, drawRef]);

  // ✅ Guardar cambios (insert/update)
  const handleSave = useCallback(async () => {
    if (!drawRef?.current) {
      toast.error("Mapbox Draw no está disponible.");
      return;
    }

    const draw = drawRef.current;
    const drawn = draw.getAll();

    if (!drawn.features.length) {
      toast.error("No hay geometrías dibujadas para guardar.");
      return;
    }

    const feature = drawn.features[0];
    const xml = generateWFSTransaction(feature, isEditing ? "update" : "insert");

    try {
      const response = await sendTransaction(xml);
      console.log("📡 Respuesta GeoServer:", response);
      toast.success(isEditing ? "Feature actualizado." : "Feature insertado.");

      draw.deleteAll();
      setIsEditing(false);
      dispatch(clearSelectedFeature());
    } catch (err) {
      console.error("Error al enviar transacción WFS-T:", err);
      toast.error("Error al guardar cambios en GeoServer.");
    }
  }, [drawRef, isEditing, dispatch]);

  // ✅ Eliminar feature
  const handleDelete = useCallback(async () => {
    if (!selectedFeature) {
      toast.error("Selecciona un feature antes de eliminar.");
      return;
    }

    try {
      const xml = generateWFSTransaction(selectedFeature, "delete");
      const response = await sendTransaction(xml);
      console.log("🗑️ Respuesta de eliminación:", response);

      toast.success("Feature eliminado correctamente.");
      dispatch(clearSelectedFeature());
    } catch (err) {
      console.error("Error al eliminar feature:", err);
      toast.error("No se pudo eliminar el feature.");
    }
  }, [selectedFeature, dispatch]);

  // ✅ Limpieza automática del estado cuando se elimina o guarda
  useEffect(() => {
    if (!selectedFeature && isEditing) {
      setIsEditing(false);
    }
  }, [selectedFeature, isEditing]);

  return {
    handleSelectFeature,
    handleEdit,
    handleSave,
    handleDelete,
    isEditing,
    selectedFeature,
  };
};
