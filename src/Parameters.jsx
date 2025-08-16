import React from "react";

export default function Parameters({ layers, selectedId, setLayers }) {

    const selectedLayer = layers.find(layer => layer.id === selectedId);

  if (!selectedLayer) {
    return <div>No selected layer</div>;
  }

  const handleChange = (index, value) => {
    const updatedLayers = layers.map(layer =>
      layer.id === selectedId
        ? {
            ...layer,
            parameter: layer.parameter.map((p, i) =>
              i === index ? Number(value) : p
            )
          }
        : layer
    );
    setLayers(updatedLayers);
  };

  return (
    <div>
      <h3>{selectedLayer.name}</h3>
      {selectedLayer.parameter.map((param, i) => (
        <div key={i}>
          <label>
            Parameter {i + 1}:{" "}
            <input
              type="number"
              value={param}
              onChange={e => handleChange(i, e.target.value)}
            />
          </label>
        </div>
      ))}

      <button onClick={() => setLayers(layers.filter(layer => layer.id !== selectedId))}>
        Delete Layer 
      </button>
    </div>
  );
}
