import { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export function AccordionPanel({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2 text-left font-semibold text-sm 
        ${
          open ? 'bg-white' : 'bg-gray-100'
        }`}
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div className="p-4 text-sm">{children}</div>}
    </div>
  );
}
