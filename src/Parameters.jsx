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
        <div key={i} style={{ marginBottom: "10px" }}>
          <label>
            Parameter {i + 1}:{" "}
            <input
              type="number"
              value={param}
              onChange={e => handleChange(i, e.target.value)}
              style={{ width: "70px", marginRight: "10px" }}
            />
          </label>

          {/* Slider synchronizowany z inputem */}
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={param}
            onChange={e => handleChange(i, e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={() =>
          setLayers(layers.filter(layer => layer.id !== selectedId))
        }
      >
        Delete Layer
      </button>
    </div>
  );
}
