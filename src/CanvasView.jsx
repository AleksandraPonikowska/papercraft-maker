import React, { useRef, useEffect } from "react";

export default function CanvasView({ layers, hoveredId, selectedId }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw(); 
    };

    const draw = () => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        ctx.moveTo(0, canvas.height * 0.9);
        ctx.lineTo(canvas.width, canvas.height * 0.9);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#c8c8c8ff";
        ctx.stroke();

      let yOffset = canvas.height * 0.9;

      layers.forEach(layer => {
        if (layer.type === 0) {
          const [a, b, h] = layer.parameter;

          const x = canvas.width / 2;
          const y = yOffset;

          ctx.beginPath();
          ctx.moveTo(x - a/2, y);
          ctx.lineTo(x + a/2, y);
          ctx.lineTo(x + a/2, y - h);
          ctx.lineTo(x - a/2, y - h);
          ctx.closePath();

          if (layer.id === hoveredId) {
            ctx.fillStyle = "#e9e9e9ff";
            ctx.fill();
          }

          if (layer.id === selectedId) {
            ctx.fillStyle = "#bababaff";
            ctx.fill();
          }

          ctx.lineWidth = 2;
          ctx.strokeStyle = "#000000ff";
          ctx.stroke();

          


          yOffset -= h;
        }
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [layers, hoveredId, selectedId]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: "1px solid #000",
        }}
      />
    </div>
  );
}
