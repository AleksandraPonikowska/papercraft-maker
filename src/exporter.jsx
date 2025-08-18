import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function exportLayers(layers) {

  const zip = new JSZip();

  for (let layer of layers) {

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");

    switch (layer.type) {
      case 0:
        drawCubeNet(ctx, layer.parameter);
        break;
      default:
        drawError(ctx);
        break;
    }

    await new Promise(resolve => canvas.toBlob(blob => {
      zip.file(`${layer.name}.png`, blob);
      resolve();
    }, "image/png"));

  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "papercraft_layers.zip");
}

function drawError(ctx, parameters) {
    ctx.fillStyle = "#ff0000ff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCubeNet(ctx, parameters) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const [a = 80, b = 80, h = 80] = parameters;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    const startX = 50;
    const startY = 50 + b;

    ctx.strokeRect(startX, startY, a, h);
    ctx.strokeRect(startX+a, startY, b, h);
    ctx.strokeRect(startX+a+b, startY, a, h);
    ctx.strokeRect(startX+a+b+a, startY, b, h);

    ctx.strokeRect(startX+a+b, startY, a, -b);
    ctx.strokeRect(startX+a+b, startY+h, a, b);

}
