// src/Layer.jsx
import React from "react";

export default function Layer({ name, type, onHoverChange, onClickChange }) {
  return (
    <div className="layer"
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onClick={() => onClickChange(true)}
        >
    
        <div className = "layer__buttons"> 
            <button className = "layer__button">▲</button>
            <button className = "layer__button">▼</button>
        </div>
        <div className="layer__type">

        </div>
        <div className="layer__name">
            {name}
        </div>
        
    </div>
  );
}
