export const Input = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  type = "text",
  width = 300,
  height = 33,
  disabled = false,
  readOnly = false,
  required = false,
  autoComplete = "off",
  autoFocus = false,
  className = "",
  style = {},
  error = "",
}) => {
  return (
    <div style={{ width }}>
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700 mb-1 block">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={`text-sm text-black border border-gray-400 focus:outline-none focus:border-[#42a5f5] px-2 py-1 rounded w-full ${className}`}
        style={{ height, ...style }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
