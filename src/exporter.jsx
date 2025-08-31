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
      case 1:
        drawBody(ctx, layer.parameter);
        break;
      case 3:
        drawHands(ctx, layer.parameter);
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

  const x1Offset = x1 + offsetX;
  const y1Offset = y1 + offsetY;
  const x2Offset = x2 + offsetX;
  const y2Offset = y2 + offsetY;

  ctx.strokeStyle = "#bbbbbbff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2Offset * 3/4 + x1Offset * 1/4, y2Offset * 3/4 + y1Offset * 1/4);
  ctx.lineTo(x2Offset * 1/4 + x1Offset * 3/4, y2Offset * 1/4 + y1Offset * 3/4);
  ctx.closePath();
  ctx.stroke();
}



function drawCubeNet(ctx, parameters) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const [a, b, h] = parameters;

    const startX = 50;
    const startY = 50 + b;

    drawFold(ctx, [startX, startY, startX+a, startY], 20);
    drawFold(ctx, [startX+a, startY, startX+a+b, startY], 20);
    //drawFold(ctx, [startX+a+b, startY-b, startX+a+b+a, startY-b], 20);
    drawFold(ctx, [startX+a+b+a, startY, startX+a+b+a+b, startY], 20);

    drawFold(ctx, [startX, startY+h, startX+a, startY+h], -20);
    drawFold(ctx, [startX+a, startY+h, startX+a+b, startY+h], -20);
    //drawFold(ctx, [startX+a+b, startY+b+h, startX+a+b+a, startY+b+h], -20);
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


function drawHands(ctx, parameters) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const [a, b, c, d] = parameters;
    
    const startX = 50;
    const startY = 50;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + d, startY);
    ctx.lineTo(startX + c, startY+a);
    ctx.lineTo(startX + c, startY+a+b);
    ctx.lineTo(startX + d, startY+a+b+a);
    ctx.lineTo(startX + d, startY+a+b+a);
    ctx.lineTo(startX, startY+a+b+a);
    ctx.lineTo(startX, startY)

    ctx.stroke();


    ctx.moveTo(startX + c + 16, startY+a)
    ctx.lineTo(startX + c + 16, startY+a+b)
    ctx.lineTo(startX + c + 16 + d , startY+a+b+a)
    ctx.lineTo(startX + c + 16 + c , startY+a+b+a)
    ctx.lineTo(startX + c + 16 + c , startY)
    ctx.lineTo(startX + c + 16 + d , startY)
    ctx.lineTo(startX + c + 16, startY+a)

    ctx.stroke();

    ctx.strokeRect(startX, startY+a, 16+c+c, b);




}

function generateTrapezePoints(a, b, h){
    return [
      [0,0],
      [a,0],
      [a+(b-a)/2 ,h ],
      [-(b-a)/2, h]
     
             
    ]
}

function translatePoints(points, dx, dy) {
    return points.map(([x, y]) => [x + dx, y + dy]);
}

function rotatePoints(points, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map(([x, y]) => [
    x * cos - y * sin,
    x * sin + y * cos
  ]);
}

function gluePoints(t0, p0, t1, p1) {

  let shifted = translatePoints(t0, -t0[p1][0], -t0[p1][1]);

  let nextP1 = (p1 + 1) % t0.length;
  let v0 = [
    t0[nextP1][0] - t0[p1][0],
    t0[nextP1][1] - t0[p1][1]
  ];

  let nextP0 = (p0 - 1) % t1.length;
  let v1 = [
    t1[nextP0][0] - t1[p0][0],
    t1[nextP0][1] - t1[p0][1]
  ];

  let angle0 = Math.atan2(v0[1], v0[0]);
  let angle1 = Math.atan2(v1[1], v1[0]);
  let rotation = angle1 - angle0;

  let rotated = rotatePoints(shifted, rotation);

  return translatePoints(rotated, t1[p0][0], t1[p0][1]);
}

function drawPoints(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const point of points.slice(1)) {
        ctx.lineTo(point[0], point[1]);
    }
    ctx.closePath();
    ctx.stroke();
  }




function drawBody(ctx, parameters) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const [a, b, c, d, e, f, g, h] = parameters;
    
    const startX = 50;
    const startY = 50;

    const front_h = Math.sqrt(f*f + (e-h)/2 * (e-h)/2);
    const side_h = Math.sqrt(f*f + (d-g)/2 * (d-g)/2);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.strokeRect(startX, startY, g,h);
    ctx.closePath();

    let points1 = generateTrapezePoints(g, d, front_h);
    points1 = translatePoints(points1, startX, startY+h);
    drawPoints(ctx, points1);

    let points2 = generateTrapezePoints(h, e, side_h);
    points2 = gluePoints(points2, 2, points1, 3);

    drawPoints(ctx,points2);

}
