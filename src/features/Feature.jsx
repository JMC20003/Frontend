import NavbarContainer from './navbar/NavbarContainer'
import { Sidepanels } from './content-side-panels/Sidepanels'
import { MapContainer } from './map/MapContainer'

import { useGlobalState } from '../shared/context/GlobalState'
import { useDrawingTool } from '../shared/map/hooks/useDrawingTool'


export const FeatureContainer = () => {
  const {openPanel} = useGlobalState();
  const { handleDelete, handleEdit, handleSave, handleToolSelection, isEditing, selectedFeature } = useDrawingTool();

  
  return (
    <>
        <NavbarContainer
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleToolSelection={handleToolSelection}
          isEditing={isEditing}
          selectedFeature={selectedFeature}
        />
        <Sidepanels/>
        <MapContainer/>
    </>
  )
}
