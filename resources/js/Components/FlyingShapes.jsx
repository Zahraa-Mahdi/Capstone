import React from "react";
import "./FlyingShape.css";
const FlyingShapes = ({ icon, size = 40, radius = 30, duration = 10, delay = 0, color = '#F76B25', centerX = '50%', centerY = '50%' }) => {
  const style = {
    position: 'absolute',
    top: centerY,
    left: centerX,
    width: `${size}px`,
    height: `${size}px`,
    margin: `-${size / 2}px 0 0 -${size / 2}px`, // center shape on orbit center
    color,
    animation: `orbit ${duration}s linear infinite`,
    animationDelay: `${delay}s`,
    transformOrigin: `${radius}px center`,  // radius px to the right as orbit radius
    fontSize: `${size}px`,
    pointerEvents: 'none',
  };

  return <div style={style}>{icon}</div>;
};

export default FlyingShapes;
