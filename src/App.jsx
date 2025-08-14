import React, {useState, useRef} from "react";
import Layer from "./Layer";

export default function App() {

  const [layers, setLayers] = useState([]);
  
  const addLayer = () => {
    const newLayer = {
      id: layers.length + 1,
      name: `Layer ${layers.length + 1}`,
      type: 0,
      parameter: [100, 100, 100]
    };
    setLayers([...layers, newLayer]);
  };

  const dragLayer = useRef(null); 
  const draggedOverLayer = useRef(null);

  function handleSort() {
    const layersClone = [...layers];
    const temp = layersClone[dragLayer.current];
    layersClone[dragLayer.current] = layersClone[draggedOverLayer.current];
    layersClone[draggedOverLayer.current] = temp;
    setLayers(layersClone);
    dragLayer.current = null;
    draggedOverLayer.current = null;
  }
  return (
    <div className="container">
      <div className="panel">
        <h2 className="panel__title">View</h2>
        <div className="surface"></div>
      </div>
      <div className="panel">
        <h2 className="panel__title">Elements</h2>
        <div className="surface">
          {layers.map((layer, index) => (
            <div className = "layer"
              draggable
              onDragStart ={() => {dragLayer.current = index}}
              onDragEnter ={() => {draggedOverLayer.current = index}}
              onDragEnd = {handleSort}
              onDragOver = {(e) => e.preventDefault()}
            >  
              {layer.name}
            </div>
          ))}
        </div>
        <button className="button" onClick={addLayer}>+</button>
      </div>
      <div className="panel">
        <h2 className="panel__title">Parametrs</h2>
        <div className="surface"></div>
      </div>
    </div>
  );
}