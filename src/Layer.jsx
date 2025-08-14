// src/Layer.jsx
import React from "react";

export default function Layer({ name, type }) {
  return (
    <div className="layer"
        draggable
        onDragStart = {() => {dragLayer.current = id}}
    >
      {name}
    </div>
  );
}
