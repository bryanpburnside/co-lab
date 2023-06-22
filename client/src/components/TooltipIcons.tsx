import React, { useState } from 'react';
import { IconType } from 'react-icons';
import '../styles.css';

interface TooltipIconProps {
  children?: React.ReactNode;
  icon: IconType;
  tooltipText: string;
  handleClick: () => void;
  style?: React.CSSProperties;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ icon: Icon, tooltipText, handleClick, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
      onClick={ handleClick }
      style={ style }
    >
      <Icon size={30} />
      {isHovered && <div className="tooltip-text">{ tooltipText }</div>}
    </div>
  );
};

export default TooltipIcon;

