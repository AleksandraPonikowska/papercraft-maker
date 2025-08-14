// src/Layer.jsx
import React from "react";

export default function Layer({ name, type }) {
  return (
    <div className="layer">
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
