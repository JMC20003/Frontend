export function Card({ title, children, height = '250', width = '350', position = 'top-left', className = 'p-2' }) {
  const positionMap = {
    'top-left': 'top-[57px] left-5',
    'top-right': 'top-[57px] right-5',
    'bottom-left': 'bottom-[12px] left-5',
    'bottom-right': 'bottom-[12px] right-5',
    'center-left': 'top-[40%]  left-5',
    'center-right': 'top-[40%] right-5',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  const resolvedPosition = positionMap[position] || positionMap['top-left'];

  return (
    <div
      style={{
        width: `${width}px`,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        height: `${height}px`,
      }}
      className={`absolute ${resolvedPosition} ${className} rounded border border-gray-200 bg-white shadow-sm z-[800]`}
    >
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-2 py-1 sticky top-0 bg-white w-full z-[800]">{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
}
