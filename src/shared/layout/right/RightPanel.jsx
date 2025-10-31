import { useEffect, useState } from "react"
import { useGlobalState } from '@/shared/context/GlobalState'
import { ChevronRightIcon, Cross1Icon } from "@radix-ui/react-icons"
import { usePanelTabs } from "../hook/usePanelTabs"
import { TabsBar } from "../components/TabsBar"
import { PanelFooterButtons } from "../components/PanelFooterButtons"
import { Sidepanels } from "../../../features/content-side-panels/Sidepanels"

export const RightPanel = ({ title = "Panel", tabs = [], footerButtons = [], handleSaveStyle, handleCancelStyle }) => {
  const { openPanel, setOpenPanel } = useGlobalState()
  const { activeTab, setActiveTab, currentTab } = usePanelTabs(tabs)
  const [width, setWidth] = useState(350)
  const [isDragging, setIsDragging] = useState(false)

  console.log('RightPanel: footerButtons received:', footerButtons);

  const handleClose = () => {
    setOpenPanel(prev => ({ ...prev, right: false }))
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const newWidth = window.innerWidth - e.clientX
    if (newWidth > 250 && newWidth < window.innerWidth - 100) {
      setWidth(newWidth)
    }
  }

  const handleMouseUp = () => setIsDragging(false)

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)

      }
    }
  }, [isDragging])

  return (
    <>
      <div style={{ width }} className={`${!openPanel.right && 'hidden'} absolute top-[96px] h-[calc(100dvh-96px)] right-0 z-[800]`}>
        <div className="relative py-2 bg-white h-full border-t-4 border-gray-400/70 flex flex-col">
          {/* Header */}
          <div className="mt-12 flex justify-between pr-2 items-center border-b border-gray-300">
            <h1 className="text-lg">{title}</h1>
            <span
              onClick={handleClose}
              className="text-gray-400 cursor-pointer p-1 rounded hover:bg-red-300 hover:text-black"
            >
              <Cross1Icon />
            </span>
          </div>

          {/* Tabs */}
          <TabsBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Scrollable Content */}
          <div className="w-full overflow-auto flex-grow">
            {currentTab?.content}
          </div>

            {/* Reusable Footer */}
            {footerButtons.length > 0 && <PanelFooterButtons buttons={footerButtons} />}
        </div>
      </div>

      {/* Toggle + Resizer */}
      {!openPanel.right ? (
        <button
          onClick={() => setOpenPanel(prev => ({ ...prev, right: true }))}
          className="bg-white absolute px-0.5 py-2 top-1/2 border border-gray-300 rounded-l-none cursor-pointer rotate-180 right-0 z-[950]"
        >
          <ChevronRightIcon />
        </button>
      ) : (
        <div
          style={{ right: `${width}px` }}
          className="z-[900] absolute h-full w-2 bg-gray-200 cursor-e-resize hover:bg-gray-300 border-x border-gray-300"
          onMouseDown={handleMouseDown}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-0.5 h-8 bg-gray-400 rounded"></div>
          </div>
        </div>
      )}
    </>
  )
}
