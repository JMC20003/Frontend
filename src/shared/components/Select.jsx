import { useState } from 'react';

export const Select = ({
  label,
  options = [],
  placeholder = 'Seleccione...',
  value,
  onChange,
  width = 300,
  height = 30,
  disabled = false,
  required = false,
  error = '',
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <div style={{ width }} className="relative text-sm">
      {label && (
        <label className="text-gray-700 block mb-1">{label}</label>
      )}

      <div
        className={`${open ? 'border-[#42a5f5]': 'border-gray-400'} border rounded px-2 py-1 text-black bg-white cursor-pointer  focus-within:border-[#42a5f5] ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => !disabled && setOpen(!open)}
        style={{ height }}
      >
        {options.find((opt) => opt.value === value)?.label || (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Opciones */}
      {open && (
        <div
          className="absolute left-0 z-50 mt-1 w-full bg-white border border-gray-300 shadow-md rounded max-h-48 overflow-auto"
          style={{ maxHeight: 180 }}
        >
          {options.length > 5 && (
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#42a5f5]"
              />
            </div>
          )}
          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="px-3 py-1 hover:bg-[#42a5f5] cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
          {!filteredOptions.length && (
            <div className="px-3 py-2 text-gray-400">Sin resultados</div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
