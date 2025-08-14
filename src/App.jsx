import React, {useState, useRef} from "react";
import Layer from "./Layer";
import CanvasView from "./CanvasView";

export default function App() {

  const [layers, setLayers] = useState([
    {
      id: 1,
      name: "Layer 1",
      type: 0,
      parameter: [100, 100, 150]
    },
    {
      id: 2,
      name: "Layer 2",
      type: 0,
      parameter: [150, 200, 150]
    },
    {
      id: 3,
      name: "Layer 3",
      type: 0,
      parameter: [100, 100, 100]
    }
  ]);

  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(-1);



  
  const addLayer = () => {
    const newLayer = {
      id: layers.length + 1,
      name: `Layer ${layers.length + 1}`,
      type: 0,
      parameter: [100, 100, 100]
    };
    setLayers([...layers, newLayer]);
  };

  return (
    <div className="container">
      <div className="panel">
        <h2 className="panel__title">View</h2>
        <div className="surface">
          <CanvasView layers={layers} hoveredId={hoveredId} selectedId = {selectedId}/>
        </div>
      </div>
      <div className="panel">
        <h2 className="panel__title">Elements</h2>
        <div className="surface">
          {[...layers].reverse().map((layer, index) => (
            <Layer
              name={layer.name}
              type={layer.type}
              state={layer.id === hoveredId ? 1 : 0}
              onHoverChange={hover => setHoveredId(hover ? layer.id : null)}
              onClickChange={select => setSelectedId(select ? layer.id : null)}

            />
          ))}
        </div>
        <button className="add_button" onClick={addLayer}>+</button>
      </div>
      <div className="panel">
        <h2 className="panel__title">Parametrs</h2>
        <div className="surface"></div>
      </div>
    </div>
  );
}