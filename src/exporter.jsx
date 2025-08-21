import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function exportLayers(layers, canvasRef) {

  const zip = new JSZip();

  for (let layer of layers) {

    //const canvas = document.createElement("canvas");
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");

    switch (layer.type) {
      case 0:
        drawCubeNet(ctx, layer.parameter);
        break;
      default:
        //drawError(ctx);
        break;
    }

    await new Promise(resolve => canvas.toBlob(blob => {
      zip.file(`${layer.name}.png`, blob);
      resolve();
    }, "image/png"));

  }

  const content = await zip.generateAsync({ type: "blob" });
  //saveAs(content, "papercraft_layers.zip");
}

function drawError(ctx, parameters) {
    ctx.fillStyle = "#ff0000ff";
    //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


function drawFold(ctx, line, depth) {
  const [x1, y1, x2, y2] = line;

  const dx = x2 - x1;
  const dy = y2 - y1;

  const len = Math.sqrt(dx * dx + dy * dy);

  const nx = dy / len;
  const ny = -dx / len;

  const offsetX = nx * depth;
  const offsetY = ny * depth;

  ctx.strokeStyle = "#bbbbbbff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo((x2 + offsetX*3/4), (y2 + offsetY*3/4));
  ctx.lineTo(x1 + offsetX*3/4, y1 + offsetY*3/4);
  ctx.closePath();
  ctx.stroke();
}



function drawCubeNet(ctx, parameters) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const [a = 80, b = 80, h = 80] = parameters;

    

    
    const startX = 50;
    const startY = 50 + b;

    drawFold(ctx, [startX, startY, startX+a, startY], 20);
    drawFold(ctx, [startX+a, startY, startX+a+b, startY], 20);
    drawFold(ctx, [startX+a+b, startY-b, startX+a+b+a, startY-b], 20);
    drawFold(ctx, [startX+a+b+a, startY, startX+a+b+a+b, startY], 20);

    drawFold(ctx, [startX, startY+h, startX+a, startY+h], -20);
    drawFold(ctx, [startX+a, startY+h, startX+a+b, startY+h], -20);
    drawFold(ctx, [startX+a+b, startY+b+h, startX+a+b+a, startY+b+h], -20);
    drawFold(ctx, [startX+a+b+a, startY+h, startX+a+b+a+b, startY+h], -20);

    drawFold(ctx, [startX+a+b+a+b, startY, startX+a+b+a+b, startY+h], 20);



    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;


    ctx.strokeRect(startX, startY, a, h);
    ctx.strokeRect(startX+a, startY, b, h);
    ctx.strokeRect(startX+a+b, startY, a, h);
    ctx.strokeRect(startX+a+b+a, startY, b, h);

    ctx.strokeRect(startX+a+b, startY, a, -b);
    ctx.strokeRect(startX+a+b, startY+h, a, b);

}
