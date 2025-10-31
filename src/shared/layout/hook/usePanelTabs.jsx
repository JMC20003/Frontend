import { useEffect, useState } from "react"
import { useGlobalState } from "@/shared/context/GlobalState"

export const usePanelTabs = (tabs = []) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || null)
  const { openPanel } = useGlobalState()

  const currentTab = tabs.find(tab => tab.key === activeTab)

    useEffect(() => {
        const group = document.querySelector('.maplibregl-ctrl-group');
        const scale = document.querySelector('.maplibregl-ctrl-bottom-left');

        if (group) {
            group.classList.toggle('maplibregl-ctrl-group-left-360', openPanel.left);
        }

        if (scale) {
            scale.classList.toggle('maplibregl-ctrl-group-left-360', openPanel.left);
        }

        if (scale) {
            scale.classList.toggle('maplibregl-ctrl-scale-bottom-250', openPanel.bottom);
        }
    }, [openPanel.left, openPanel.bottom]);


  return {
    activeTab,
    setActiveTab,
    currentTab,
    tabs
  }
}
