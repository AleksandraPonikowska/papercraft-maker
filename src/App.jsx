import React from "react";

export default function App() {
  return (
    <div className="container">
      <div className="panel">
        <h2 className="panel__title">View</h2>
        <div className="surface"></div>
      </div>
      <div className="panel">
        <h2 className="panel__title">Elements</h2>
        <div className="surface">
          lista
        </div>
        <button className="button">+</button>
      </div>
      <div className="panel">
        <h2 className="panel__title">Parametrs</h2>
        <div className="surface"></div>
      </div>
    </div>
  );
}