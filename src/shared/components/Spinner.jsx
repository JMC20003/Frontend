import React from 'react';

const sizeMap = {
  small: 20,
  medium: 40,
  large: 60,
};

const borderSizeMap = {
  small: '2px',
  medium: '4px',
  large: '6px',
};

function Spinner({
  size = 'medium',
  border = [{ side: 'all', color: '#3b82f6', size: 'medium', style: 'solid' }],
  message = '',
  className = '',
}) {
  const sizePx = sizeMap[size] || 40;

  const generateBorderStyle = () => {
    const styles = {};

    border.forEach(({ side, color = '#3b82f6', size = 'medium', style = 'solid' }) => {
      const borderValue = `${borderSizeMap[size] || '4px'} ${style} ${color}`;

      switch (side) {
        case 'all':
          styles.border = borderValue;
          break;
        case 'top':
          styles.borderTop = borderValue;
          break;
        case 'right':
          styles.borderRight = borderValue;
          break;
        case 'bottom':
          styles.borderBottom = borderValue;
          break;
        case 'left':
          styles.borderLeft = borderValue;
          break;
        case 'horizontal':
          styles.borderLeft = borderValue;
          styles.borderRight = borderValue;
          break;
        case 'vertical':
          styles.borderTop = borderValue;
          styles.borderBottom = borderValue;
          break;
        default:
          break;
      }
    });

    return styles;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="rounded-full animate-spin box-border"
        style={{
          width: sizePx,
          height: sizePx,
          ...generateBorderStyle(),
        }}
      />
      {message && <span className="text-gray-700 text-sm">{message}</span>}
    </div>
  );
}

export default Spinner;
