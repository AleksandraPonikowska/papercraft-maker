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
        if (layer.type === 1) {
          const [a1, b1,h1, a2,b2,h2,a3,b3] = layer.parameter;

          for(let i = 0; i < 2; i++) {

            const y = yOffset;

            if (i == 0){
                
                const x = canvas.width / 4;

                ctx.beginPath();

                ctx.moveTo(x - a1 / 2, y);
                ctx.lineTo(x + a1 / 2, y);
                ctx.lineTo(x + a2 / 2, y - h1);
                ctx.lineTo(x - a2 / 2, y - h1);

                ctx.lineTo(x - a3 / 2, y - h1 - h2);
                ctx.lineTo(x + a3 / 2, y - h1 - h2);
                

                ctx.lineTo(x + a2 / 2, y - h1);
                ctx.lineTo(x - a2 / 2, y - h1);


                ctx.closePath();
            } else {

                const x = canvas.width / 4 * 3;

                ctx.beginPath();

                ctx.moveTo(x - b1 / 2, y);
                ctx.lineTo(x + b1 / 2, y);
                ctx.lineTo(x + b2 / 2, y - h1);
                ctx.lineTo(x - b2 / 2, y - h1);

                ctx.lineTo(x - b3 / 2, y - h1 - h2);
                ctx.lineTo(x + b3 / 2, y - h1 - h2);
                

                ctx.lineTo(x + b2 / 2, y - h1);
                ctx.lineTo(x - b2 / 2, y - h1);


                ctx.closePath();
            }

            

            if (layer.id === hoveredId) {
              ctx.fillStyle = "#e9e9e9ff";
              ctx.fill();
            }

            if (layer.id === selectedId) {
              ctx.fillStyle = "#e0c1c1ff";
              ctx.fill();
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000000ff";
            ctx.stroke();
          }       

          yOffset -= h1 + h2;
        } else if (layer.type === 0) {
          const [a, b, h] = layer.parameter;

          for(let i = 0; i < 2; i++) {

            const y = yOffset;

            if (i == 0){
                
                const x = canvas.width / 4;

                ctx.beginPath();
                ctx.moveTo(x - a / 2, y);
                ctx.lineTo(x + a / 2, y);
                ctx.lineTo(x + a / 2, y - h);
                ctx.lineTo(x - a / 2, y - h);
                ctx.closePath();
            } else {

                const x = canvas.width / 4 * 3;

                ctx.beginPath();
                ctx.moveTo(x - b / 2, y);
                ctx.lineTo(x + b / 2, y);
                ctx.lineTo(x + b / 2, y - h);
                ctx.lineTo(x - b / 2, y - h);
                ctx.closePath();
            }

            

            if (layer.id === hoveredId) {
              ctx.fillStyle = "#e9e9e9ff";
              ctx.fill();
            }

            if (layer.id === selectedId) {
              ctx.fillStyle = "#e0c1c1ff";
              ctx.fill();
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000000ff";
            ctx.stroke();
          }       

          yOffset -= h;

        } else if (layer.type === 2) {
          const [radius, depth] = layer.parameter;

          for (let i = 0; i < 2; i++) {
            const y = yOffset;
            const x = i === 0 ? canvas.width / 4 : (canvas.width / 4) * 3;

            if (i === 0) { 
              ctx.beginPath();
              ctx.arc(x, y - radius/2, radius/2, 0, 2 * Math.PI);
            }
            else { 
              ctx.beginPath();
                ctx.moveTo(x - depth/2, y);
                ctx.lineTo(x + depth/2, y);
                ctx.lineTo(x + depth/2, y - radius);
                ctx.lineTo(x - depth/2, y - radius);
                ctx.closePath();
            }

            if (layer.id === hoveredId) {
              ctx.fillStyle = "#e9e9e9ff";
              ctx.fill();
            }

            if (layer.id === selectedId) {
              ctx.fillStyle = "#e0c1c1ff";
              ctx.fill();
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000000ff";
            ctx.stroke();
          }

          yOffset -= radius;
        } else if (layer.type == 3) {

          const [a,b,c,d] = layer.parameter;

          for (let i = 0; i < 2; i++) {
            const y = yOffset;
            const x = i === 0 ? canvas.width / 4 : (canvas.width / 4) * 3;
            ctx.beginPath();
            
            if (i === 0) {
              ctx.moveTo(x + 16/2, y)
              ctx.lineTo(x + 16/2 + c, y);
              ctx.lineTo(x + 16/2 + c, y+a);
              ctx.lineTo(x + 16/2 + d, y+a);

              ctx.lineTo(x + 16/2, y);


              ctx.moveTo(x - 16/2, y)
              ctx.lineTo(x - 16/2 - c, y);
              ctx.lineTo(x - 16/2 - c, y+a);
              ctx.lineTo(x - 16/2 - d, y+a);

              ctx.lineTo(x - 16/2, y);
            } else {
              ctx.moveTo(x +16/2, y);
            }

            

            if (layer.id === hoveredId) {
              ctx.fillStyle = "#e9e9e9ff";
              ctx.fill();
            }

            if (layer.id === selectedId) {
              ctx.fillStyle = "#e0c1c1ff";
              ctx.fill();
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000000ff";
            ctx.stroke();
          }
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
