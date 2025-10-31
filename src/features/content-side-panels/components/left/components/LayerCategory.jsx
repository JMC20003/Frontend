import { useEffect, useRef } from "react";
import SortableListContainer from "@/shared/components/SortableListContainer";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { getLayerVisibility } from "../helper/getLayerVisibility";
import { useSelector } from "react-redux";
import { showList, showTag } from "../const/IconsLayers";
import { changeLayerColor } from "../helper/changeLayerColor";

const LayerCategory = ({
  category,
  layers,
  currentZoom,
  expanded,
  toggleExpand,
  toggleCategoryLayers,
  handleSelectLayer,
  toggleLayer,
  layerActiveGeoserver,
  setOrderedLayers,
  selectLayerTableDown
}) => {
  const mapRef = useSelector((s) => s.mapReducer.mapRef);
  const catRef = useRef(null);
  const allActive = layers.every((l) => getLayerVisibility(l.styles[0].id, mapRef));
  const someActive = layers.some((l) => getLayerVisibility(l.styles[0].id, mapRef));

  useEffect(() => {
    if (catRef.current) {
      catRef.current.indeterminate = someActive && !allActive;
    }
  }, [someActive, allActive]);

  const items = layers
    .filter((layer) => layer?.table && layer?.styles?.length > 0)
    .map((layer) => {
      const styleId = layer.styles?.[0]?.id;
      const minZoom = layer.styles?.[0]?.minzoom ?? 0;
      return {
        id: layer.table,
        label: layer.table,
        visible: styleId ? getLayerVisibility(styleId, mapRef) : false,
        disabled:
          currentZoom !== null && currentZoom < minZoom ? true : false,
        data: layer,
      };
    });

  return (
    <div key={category} className="mb-3 border-b border-gray-300 pb-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span
          onClick={() => toggleExpand(category)}
          className="text-lg cursor-pointer select-none transform transition-transform"
        >
          {expanded ? "◂" : "▸"}
        </span>
        <input
          ref={catRef}
          type="checkbox"
          id={`cat-${category}`}
          checked={allActive}
          onChange={() => toggleCategoryLayers(category, layers)}
          className="h-4 w-4 accent-[#49b0f2] text-white"
        />
        <label
          onClick={() => toggleExpand(category)}
          className="text-[11px] cursor-pointer select-none text-gray-800"
        >
          {category}
        </label>
      </div>

      {/* Lista */}
      {expanded && (
        <SortableListContainer
          items={items}
          onOrderChange={(newOrder) => {
            const reordered = newOrder.map((item) => item.data);
            setOrderedLayers((prev) => {
              const groupedPrev = prev.reduce((acc, l) => {
                acc[l.schema] = acc[l.schema] || [];
                acc[l.schema].push(l);
                return acc;
              }, {});
              const result = [];
              Object.keys(groupedPrev).forEach((schema) => {
                if (schema === category) result.push(...reordered);
                else result.push(...groupedPrev[schema]);
              });
              return result;
            });
          }}
          renderItem={(item) => (
            <div
              key={item.id}
              className={`flex justify-between items-center p-2 bg-gray-50 border border-gray-200 hover:bg-sky-100 rounded cursor-pointer ${
                layerActiveGeoserver &&
                layerActiveGeoserver[item.id]?.table === item?.id &&
                "bg-sky-200"
              }`}
            >
              <span
                className={`truncate text-[11px] ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-800"
                }`}
                onClick={() => handleSelectLayer(item.data)}
              >
                {item.label}
              </span>
              <div className="flex items-center gap-1">
                <button title="Mostrar etiqueta"
                    className="p-0.5 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer h-6 w-6"
                    disabled={item.disabled}
                >
                    <img src={showTag} alt="Etiqueta" />
                </button>

                <div title="Cambiar color"
                    className="p-0.5 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer h-6 w-6"
                    disabled={item.disabled}
                >
                    <input
                      type="color"
                      name="color"
                      id="color"
                      defaultValue={'#ae5e32'}
                      pattern="^#([A-Fa-f0-9]{6})$"
                      className="h-5 w-5"
                      onChange={(e) => {
                        const newColor = e.target.value;
                        const map = mapRef?.getMap();
                        if (map) {
                          changeLayerColor(map, item.data, newColor);
                        }
                      }}
                    />
                </div>

                <button title="Tabla de atributos"
                    className="p-0.5 relative top-0.5 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer h-6 w-6"
                    disabled={item.disabled}
                    onClick={()=>selectLayerTableDown(item.data)}
                >
                    <img src={showList} alt="Tabla de atributos"/>
                </button>

                <button
                  title={item.visible ? "Ocultar capa" : "Mostrar capa"}
                  className="p-1 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer h-6 w-6"
                  disabled={item.disabled}
                  onClick={() => toggleLayer(item.id)}
                >
                    {item.visible ? <EyeOpenIcon className=" text-gray-600" /> : <EyeClosedIcon className=" text-gray-600" />}
                  
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default LayerCategory;