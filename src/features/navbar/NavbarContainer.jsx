import { useState } from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import LayerMapBaseOptions from './components/BaselayerMap/LayerMapBaseOptions';
import PersonCountButtonn from './components/personCount/PersonCountButtonn';
import { ButtonTool } from '../../shared/components/ButtonTool';
import logoIcon from '@/shared/assets/pangeacoLogo.png'
import { NAV_ITEMS } from './const/navItems';
import MapToolBar from './tools/map/MapToolBar';
import EditToolbar from './tools/edit/EditToolbar';
import SelectToolbar from './tools/select/SelectToolBar';


export default function NavbarContainer({ handleDelete, handleEdit, handleSave, handleToolSelection, isEditing, selectedFeature }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState(NAV_ITEMS);

  return (
    <div className="absolute top-0 w-full h-auto z-[950]">
      <nav
        className="bg-white w-full h-12 border-b border-gray-300 text-xs"
        style={{ position: 'absolute', zIndex: 998 }}
      >
        <div className="flex items-center justify-between h-full px-4">

          {/* Izquierda: Botón hamburguesa */}
          <div className="flex flex-1 items-center justify-start gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-1 rounded-md ${isMenuOpen ? 'bg-red-300' : 'bg-transparent'}`}
            >
              <HamburgerMenuIcon className="w-4 h-4" />
            </button>

            <img src={logoIcon} alt="logo" className="w-[120px] h-[35px] relative pl-1" />

            <div className="flex select-none">
              {navItems.map((item) => (
                <ButtonTool
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  isActive={item.active}
                  onClick={() => {
                    setNavItems((prev) =>
                      prev.map((navItem) =>
                        navItem.label === item.label
                          ? { ...navItem, active: true }
                          : { ...navItem, active: false }
                      )
                    );
                  }}
                  className={`
                        relative px-2 py-0 top-3.5 rounded-none
                        ${item.active
                      ? 'text-[#49b0f2] bg-white font-medium after:absolute after:-top-0.5 after:left-0 border-x border-gray-300 after:w-full after:h-0.5 after:bg-[#49b0f2]'
                      : ' hover:text-[#49b0f2]'}
                    `}
                />
              ))}
            </div>
          </div>


          {/* Centro: Botón Regresar */}
          <div className="flex flex-1 items-center justify-center">
            <p className="font-medium text-gray-900 relative text-[16px] top-[-10px]">Inventario de Planta Externa</p>

          </div>

          {/* Derecha: Selector de mapa base */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <LayerMapBaseOptions position={'top-right'} />
            <PersonCountButtonn name={'Demo person'} />
          </div>
        </div>
      </nav>

      {/* Sub-navbar tools */}
      <div className="absolute top-12 w-full h-[95px] text-[12px] bg-white border-b-2 border-gray-300 select-none">
        {navItems[0].active && (
          <div className="flex justify-start relative h-full">
            <MapToolBar />
          </div>
        )}

        {navItems[1].active && (
          <div className="flex justify-start relative h-full">
            <SelectToolbar
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleToolSelection={handleToolSelection}
              isEditing={isEditing}
              selectedFeature={selectedFeature}
            />
          </div>
        )}

        {navItems[2].active && (
          <div className="flex justify-start relative h-full">
            <EditToolbar />
          </div>
        )}

      </div>
    </div>

  );
}
