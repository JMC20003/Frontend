import { BottomPanel } from '@/shared/layout/bottom/BottomPanel'
import { LeftPanel } from '@/shared/layout/left/LeftPanel'
import { RightPanel } from '@/shared/layout/right/RightPanel'
import { LayerList } from './components/left/LayerList'
import { TableContent } from './components/bottom/TableContent'
import { useGlobalState } from '@/shared/context/GlobalState'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { FeatureStyleEditor } from './components/right/FeatureStyleEditor'
import { clearSelectedFeature, updateSelectedFeatureStyle } from '@/shared/redux/features/featureSlice'
import { updateFeature } from '@/features/map/services/featureAPI'
import { toast } from 'sonner'

//preguntar como funciona esto
export const Sidepanels = () => {
  const { openPanel, setOpenPanel, setSelectView } = useGlobalState()
  const dispatch = useDispatch();
  const selectedFeature = useSelector(state => state.featureReducer.selectedFeature);
  const [tempFeatureStyle, setTempFeatureStyle] = useState(null); // Estado local para cambios temporales de estilo
  const featureStyleEditorRef = useRef(); // Ref para acceder a los estilos temporales del editor

  // Efecto para abrir/cerrar el panel derecho según la selección de feature
  useEffect(() => {
    if (selectedFeature) {
      setOpenPanel(prev => ({ ...prev, right: true }));
    } else {
      setOpenPanel(prev => ({ ...prev, right: false }));
    }
  }, [selectedFeature, setOpenPanel]);

  const handleViewChange = (value) => {
    setSelectView(value)
  }

  const handleSaveStyle = async () => {
    if (!selectedFeature || !tempFeatureStyle) return;
    const updatedFeatureProperties = {
      ...selectedFeature.properties,
      // Incluir todas las propiedades de estilo relevantes de tempFeatureStyle
      'fill-color': tempFeatureStyle.fillColor,
      'line-color': tempFeatureStyle.lineColor,
      'line-width': tempFeatureStyle.lineWidth,
      'circle-color': tempFeatureStyle.circleColor,
      'circle-radius': tempFeatureStyle.circleRadius,
      'line-dasharray': tempFeatureStyle.lineDasharray,
      // Añadir otras propiedades de estilo aquí si se añaden más controles
    };

    const updatedFeature = {
      ...selectedFeature,
      properties: updatedFeatureProperties
    };

    try {
      const apiResponse = await updateFeature(updatedFeature.id, updatedFeature);
      // Actualizar el array principal de features en Redux con la respuesta de la API
      dispatch(updateSelectedFeatureStyle({ featureId: apiResponse.id, newStyle: apiResponse.properties }));
      dispatch(clearSelectedFeature()); // Deseleccionar y cerrar panel
      toast(
        <div>
          <div className="font-bold mb-2">GeoJSON actualizado:</div>
          <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', maxHeight: 300, overflow: 'auto', fontSize: 12 }}>
            {JSON.stringify(updatedFeature, null, 2)}
          </pre>
        </div>,
        {
          duration: 10000, // 10 segundos, o puedes poner Infinity para que solo se cierre con la X
          closeButton: true,
        }
      );
      toast.success("Estilo de geometría actualizado y guardado.");

    } catch (error) {
      console.error("Error al guardar el estilo de la geometría:", error);
      toast.error("Error al guardar el estilo.");
      console.log('Sidepanels: handleSaveStyle - Error toast shown.');
    }
  };

  const handleCancelStyle = () => {
    dispatch(clearSelectedFeature());
    toast.info("Cambios de estilo descartados.");
  };

  const handleTemporaryStyleChange = (newTempStyle) => {
    setTempFeatureStyle(newTempStyle);
    if (selectedFeature) {
      dispatch(updateSelectedFeatureStyle({
        featureId: selectedFeature.id,
        newStyle: {
          'fill-color': newTempStyle.fillColor,
          'circle-color': newTempStyle.circleColor,
          'line-color': newTempStyle.lineColor,
          'line-width': newTempStyle.lineWidth,
          'circle-radius': newTempStyle.circleRadius,
          'line-dasharray': newTempStyle.lineDasharray,
          // Añadir otras propiedades de estilo aquí
        }
      }));
    }
  };

  const rightPanelTabs = selectedFeature ? [
    { key: "style", label: "Estilo", content: <FeatureStyleEditor selectedFeature={selectedFeature} onStyleChange={handleTemporaryStyleChange} /> },
  ] : [];

  const rightPanelFooterButtons = selectedFeature ? [
    { label: "Guardar", onClick: handleSaveStyle, className: "bg-green-500 hover:bg-green-600 text-white" },
    { label: "Cancelar", onClick: handleCancelStyle, className: "bg-red-500 hover:bg-red-600 text-white" },
  ] : [];

  console.log('Sidepanels: rightPanelFooterButtons:', rightPanelFooterButtons);

  return (
    <>
      <LeftPanel
        title="Contenido"
        tabs={[
          { key: "layers", label: "Capas", content: <LayerList /> },
          { key: "leyend", label: "Leyenda", content: <component /> },
        ]}
      />


      <RightPanel
        title="Opciones de Estilo"
        tabs={rightPanelTabs}
        footerButtons={rightPanelFooterButtons}
        selectedFeature={selectedFeature} // Pasar selectedFeature para que RightPanel pueda pasarlo a sus hijos
      />


      <BottomPanel
        title=""
        tabs={[
          { key: "layers", label: "", content: <TableContent /> },
        ]}
        renderContent={() => (
          <>
            <select
              onChange={(e) => handleViewChange(e.target.value)}
              className="focus:outline-0 text-[12px] text-gray-900"
              defaultValue="all"
            >
              <option value="all">Entidades visibles en el mapa</option>
              <option value="selec">Entidades seleccionadas</option>
            </select>
          </>
        )}

      />
    </>
  )
}
