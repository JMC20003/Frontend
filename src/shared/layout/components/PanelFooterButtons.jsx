// src/shared/layout/components/PanelFooterButtons.jsx
import { RightPanel } from "../right/RightPanel";

export const PanelFooterButtons = ({ buttons = [] }) => {
  console.log('PanelFooterButtons: buttons received:', buttons);
  if (!buttons.length) return null

  console.log('PanelFooterButtons: Rendering footer buttons div. ClassName:', "border-t border-gray-200 px-2 py-2 flex gap-2 ");
  return (
    <div
      className="border-t border-gray-400 px-2 py-2 flex gap-2 min-h-[50px] items-center justify-center z-[9999] shadow-inner"
    >
      {buttons.map((btn, idx) => {
        console.log(`PanelFooterButtons: Rendering button ${btn.label}`);
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
