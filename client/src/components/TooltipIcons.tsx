import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon here if not already imported
import '../styles.css';

interface TooltipIconProps {
  children?: React.ReactNode;
  icon: any; // You can keep the icon prop type as 'any' if FontAwesomeIcon component is causing type issues
  tooltipText: string;
  handleClick: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  size?: number;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ icon, tooltipText, handleClick, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ ...style, position: 'relative' }}
    >
      <FontAwesomeIcon icon={icon} />
      {isHovered && <div className="tooltip-text">{tooltipText}</div>}
    </div>
  );
};

export default TooltipIcon;


