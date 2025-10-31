// src/shared/components/CheckboxGroup.jsx
export function CheckboxGroup({ title, items = [], onChange }) {
  return (
    <div className="mb-3">
      {title && <h4 className="text-sm font-semibold text-gray-700 mb-1">{title}</h4>}
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => onChange(item.id)}
              className="accent-sky-600 w-4 h-4"
            />
            {item.icon && (
              <img src={item.icon} alt="icon" className="w-5 h-5" />
            )}
            <label htmlFor={item.id} className="text-sm text-gray-800 cursor-pointer">
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
