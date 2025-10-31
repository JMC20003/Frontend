import { useState } from "react";
import { PersonIcon } from "@radix-ui/react-icons";

export default function PersonCountButtonn({name}) {
    const [openCount, setOpenCount] = useState(false)

  return (
    <button
      type="button"
      id="radix-:rn:"
      aria-haspopup="menu"
      aria-expanded="false"
      data-state="closed"
      className="aria-expanded:bg-gray-200 cursor-pointer data-state-on:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none py-1 px-2 text-sm rounded inline-flex items-center gap-x-1 font-medium text-gray-700 outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-purple-500 hover:bg-gray-200 relative"
      onClick={() => setOpenCount(!openCount)}
    >
      <PersonIcon /> <span className="hidden md:block">{name}</span>
      {openCount && (
        <>
          <div className="fixed w-full h-full inset-0 z-40" />
          <div className="absolute bg-white border border-gray-300 z-[1000] w-[180px] top-[40px] rounded text-black text-left right-0">

            <div
              // onClick={() => logoutSession()}
              className="hover:bg-gray-200 text-xs w-full py-1 pl-3 pr-3 gap-x-2 text-red-500"
            >
              Cerrar Sesión
            </div>
            <div
              // onClick={() => logoutSession()}
              className="hover:bg-gray-200 text-xs w-full py-1 pl-3 pr-3 gap-x-2 text-gray-500"
            >
              v1.0.0
            </div>
          </div>
        </>
      )}
    </button>
  );
}
