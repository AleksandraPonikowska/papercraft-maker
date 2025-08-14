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

  return (
    <div className="container">
      <div className="panel">
        <h2 className="panel__title">View</h2>
        <div className="surface"></div>
      </div>
      <div className="panel">
        <h2 className="panel__title">Elements</h2>
        <div className="surface">
          {layers.map(el => (
            <Layer
              name={el.name}
              type={el.type}
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