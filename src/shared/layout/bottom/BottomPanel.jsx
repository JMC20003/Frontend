import { useEffect, useState } from 'react';
import { useGlobalState } from '@/shared/context/GlobalState';
import { ChevronRightIcon, Cross1Icon } from "@radix-ui/react-icons";
import { usePanelTabs } from "../hook/usePanelTabs";
import { TabsBar } from '../components/TabsBar';

export const BottomPanel = ({ title = "Panel", tabs = [], renderContent = null }) => {
  const { openPanel, setOpenPanel } = useGlobalState();
  const { activeTab, setActiveTab, currentTab } = usePanelTabs(tabs);

  const [height, setHeight] = useState(250); // altura por defecto
  const [isDragging, setIsDragging] = useState(false);

  const startResize = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const windowHeight = window.innerHeight;
    const newHeight = windowHeight - e.clientY;

    // límites opcionales
    if (newHeight >= 150 && newHeight <= windowHeight - 100) {
      setHeight(newHeight);
    }
  };

  const stopResize = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopResize);
      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", stopResize);
      };
    }
  }, [isDragging]);

  return (
    <>
      {openPanel.bottom && (
        <div
          className={`
            absolute z-[799] cursor-n-resize bg-gray-300 mx-2
            ${openPanel.left ? 'left-[335px]' : 'left-0'}
            ${openPanel.right ? 'right-[352px]' : 'right-0'}
            `}
          style={{
            height: 5,
            bottom: `${height}px`,
            left: openPanel.left ? 335 : 0,
            right: openPanel.right ? 352 : 0,
          }}
          onMouseDown={startResize}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-0.5 bg-gray-400 rounded"></div>
          </div>
        </div>
      )}

      <div
        className={`
          absolute bg-white z-[1000] border-2 border-t-0 border-gray-400/70 mx-2
          ${openPanel.left ? 'left-[335px]' : 'left-0'}
          ${openPanel.right ? 'right-[352px]' : 'right-0'}
          ${!openPanel.bottom && 'hidden'}
        `}
        style={{ bottom: 0, height }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-2 border-b border-gray-300">
          <h1 className="text-lg">{title}</h1>
          
          <div className='flex items-center gap-2 py-1 text-[11px] text-gray-600'>
            {/* Botones Añadidos dinamicamnete */}
            {renderContent &&renderContent()}


            {/* Cerrar */}
            <button
              onClick={() => setOpenPanel(prev => ({ ...prev, bottom: false }))}
              className="cursor-pointer p-1 rounded hover:bg-red-300 hover:text-black"
            >
              <Cross1Icon />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <TabsBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className=" overflow-auto" style={{ height: `calc(${height}px - 40px)` }}>
          {currentTab?.content}
        </div>
      </div>

      {!openPanel.bottom && (
        <button
          onClick={() => setOpenPanel(prev => ({ ...prev, bottom: true }))}
          className="bg-white absolute bottom-[-10px] px-1 h-[40px] left-[47%] border border-gray-300 rounded-t cursor-pointer z-[950] rotate-270"
        >
          <ChevronRightIcon />
        </button>
      )}
    </>
  );
};
