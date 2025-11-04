// src/shared/layout/components/PanelFooterButtons.jsx
import { RightPanel } from "../right/RightPanel";

export const PanelFooterButtons = ({ buttons = [] }) => {
  if (!buttons.length) return null
  return (
    <div
      className="border-t border-gray-400 px-2 py-2 flex gap-2 min-h-[50px] items-center justify-center z-[9999] shadow-inner"
    >
      {buttons.map((btn, idx) => {
        return (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded cursor-pointer ${btn.className || ''}`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}
