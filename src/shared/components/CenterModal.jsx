import { useState, useRef, useEffect } from 'react';
import { Cross2Icon, SizeIcon, ExitFullScreenIcon } from '@radix-ui/react-icons';

const useModalControls = (isOpen) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const modalRef = useRef(null);
  const titleBarRef = useRef(null);

    useEffect(() => {
    if (isOpen && !isMaximized) {
        setTimeout(() => {
        const initialWidth = Math.min(window.innerWidth * 0.7, 1000);
        const initialHeight = Math.min(window.innerHeight * 0.6, 600);
        setSize({ width: initialWidth, height: initialHeight });
        setPosition({ 
            x: (window.innerWidth - initialWidth) / 2, 
            y: (window.innerHeight - initialHeight) / 2 
        });
        }, 0);
    }
    }, [isOpen, isMaximized]);


  const handleMouseDown = (e) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleResizeMouseDown = (e) => {
    if (isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }

      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(400, Math.min(resizeStart.width + deltaX, window.innerWidth - position.x));
        const newHeight = Math.max(300, Math.min(resizeStart.height + deltaY, window.innerHeight - position.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDragging ? 'move' : 'se-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, dragStart, position, size, resizeStart, isMaximized]);

  const handleMaximize = () => setIsMaximized(!isMaximized);

  const getModalStyle = () => (
    isMaximized 
      ? { width: '100dvw', height: '100dvh', left: 0, top: 0 }
      : { width: `${size.width}px`, height: `${size.height}px`, left: `${position.x}px`, top: `${position.y}px` }
  );

  return {
    isMaximized,
    modalRef,
    titleBarRef,
    handleMouseDown,
    handleResizeMouseDown,
    handleMaximize,
    getModalStyle
  };
};

const CenterModal = ({
  isOpen,
  onClose,
  title = "Modal",
  tabs = [], // [{ label: 'ODF', key: 'odf', content: <Odf /> }]
  defaultTabKey = null
}) => {
  const {
    isMaximized, modalRef, titleBarRef,
    handleMouseDown, handleResizeMouseDown,
    handleMaximize, getModalStyle
  } = useModalControls(isOpen);

  const [activeTab, setActiveTab] = useState(defaultTabKey || tabs[0]?.key);

  useEffect(() => {
    if (isOpen && defaultTabKey) {
      setActiveTab(defaultTabKey);
    }
  }, [isOpen, defaultTabKey]);

  if (!isOpen) return null;

  const activeTabContent = tabs.find(t => t.key === activeTab)?.content;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Desktop */}
      <div
        ref={modalRef}
        className={`absolute bg-white shadow-2xl border border-gray-300 overflow-hidden transition-all duration-200 ease-out ${isMaximized ? 'rounded-none' : 'rounded-lg'} hidden md:block`}
        style={getModalStyle()}
      >
        {/* TitleBar */}
        <div
          ref={titleBarRef}
          className={`bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 px-4 py-3 flex items-center justify-between ${!isMaximized ? 'cursor-move' : ''} select-none`}
          onMouseDown={handleMouseDown}
        >
          <span className="text-sm font-medium text-gray-700 ml-2">{title}</span>

          <div className="flex gap-2 text-gray-600">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-2 py-1 text-sm ${activeTab === tab.key ? 'border-b border-gray-400 font-medium' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <button onClick={handleMaximize} className="p-1.5 hover:bg-gray-300 rounded text-gray-600">
              {isMaximized ? <ExitFullScreenIcon className="w-4 h-4" /> : <SizeIcon className="w-4 h-4" />}
            </button>
            <button onClick={() => onClose(false)} className="p-1.5 hover:bg-red-300 rounded text-gray-600">
              <Cross2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 overflow-auto p-4" style={{ height: `calc(100% - 52px)` }}>
          {activeTabContent}
        </div>

        {/* Resize Handle */}
        {!isMaximized && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group" onMouseDown={handleResizeMouseDown}>
            <div className="absolute bottom-1 right-1 w-3 h-3">
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-gray-400 group-hover:bg-gray-600"></div>
              <div className="absolute bottom-0 right-2 w-1 h-1 bg-gray-400 group-hover:bg-gray-600"></div>
              <div className="absolute bottom-2 right-0 w-1 h-1 bg-gray-400 group-hover:bg-gray-600"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-gray-500 group-hover:bg-gray-700"></div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full h-full bg-white flex flex-col">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-700">{title}</h2>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-300 rounded-full text-gray-600">
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-4">{activeTabContent}</div>
        </div>
      </div>
    </div>
  );
};

export default CenterModal;
