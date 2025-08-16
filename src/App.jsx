import React, {useState, useRef} from "react";
import Layer from "./Layer";
import CanvasView from "./CanvasView";
import Parameters from "./Parameters";


export default function App() {

  const [layers, setLayers] = useState([
    {
      id: 1,
      name: "Standee",
      type: 0,
      parameter: [100, 100, 20]
    },
    {
      id: 2,
      name: "Body",
      type: 1,
      parameter: [[25, 30],38,[36,36],47,[16,20]]
    },
    {
      id: 3,
      name: "Head",
      type: 2,
      parameter: [100, 45]
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

              onArrowUp={() => {if (index > 0) {
                const newLayers = [...layers];
                [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
                setLayers(newLayers);
              }}}
              onArrowDown={() => {if (index < layers.length - 1) {
                const newLayers = [...layers];
                [newLayers[index + 1], newLayers[index]] = [newLayers[index], newLayers[index + 1]];
                setLayers(newLayers);
              }}}

            />
          ))}
        </div>
        <button className="add_button" onClick={addLayer}>+</button>
      </div>
      <div className="panel">
        <h2 className="panel__title">Parametrs</h2>
        <div className="surface">
          <Parameters layers={layers} selectedId={selectedId} setLayers={setLayers}/>
        </div>
      </div>
    </div>
  );
}