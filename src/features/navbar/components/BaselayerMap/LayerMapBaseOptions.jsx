
import { useState } from "react";

import { mapStyles } from "@/shared/map/base/styles";
import { useGlobalState } from "@/shared/context/GlobalState";

const positionClasses = {
    'top-left': 'fixed top-[57px] left-5',
    'top-right': 'fixed top-[57px] right-5',
    'bottom-left': 'fixed bottom-[12px] left-5',
    'bottom-right': 'fixed bottom-[12px] right-5',
    'center-right': 'fixed top-[50%] right-5',
    'center-left': 'fixed top-[50%] left-5',
  };

function LayerMapBaseOptions({ position = 'top-right' }) {

  const {mapType, setMapType} = useGlobalState()
  
  const [openMapaBase, setopenMapaBase] = useState(false)

  const handleOpenMapaBase = ()=>{
    setopenMapaBase(!openMapaBase)
  }

  const handleMapTypeChange = (style) => {
    setMapType(style)
  };

  const modalPosition = positionClasses[position] || 'top-[57px] right-1';

  return (
        <div>
          <img title="Mapa Base" 
          className={`${openMapaBase && "bg-gray-300 p-1"} rounded cursor-pointer min-w-10 h-9`} 
          src={mapType.preview} alt="layers" 
          onClick={handleOpenMapaBase} 
          />
          {openMapaBase && (
            <div
              className={` grid grid-cols-6 justify-center bg-[#fff] w-[350px] h-auto shadow-md shadow-[#5a5858b4] border border-gray-400/70 rounded text-[8px] z-50 ${modalPosition}`}
            >
              {mapStyles.map((style) => (
                <button
                  key={style.id}
                  className="col-span-1 cursor-pointer hover:text-sky-500 max-w-20"
                  onClick={() => handleMapTypeChange(style)}
                >
                  <img
                    className="rounded w-12 h-8 m-1 hover:scale-[1.5] border border-gray-300"
                    src={style.preview}
                    alt="Preview"
                  />
                  {style.label}
                </button>
              ))}
            </div>
          )}
        </div>
  
  );
}

export default LayerMapBaseOptions;
