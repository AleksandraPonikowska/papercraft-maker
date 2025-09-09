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
      case 2:
        drawHead(ctx, layer.parameter);
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


function generateFold(point1, point2, r, depth) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;

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

  return [
    [x1, y1],
    [x2, y2],
    [
      x2Offset * (1-r) + x1Offset * r,
      y2Offset * (1-r) + y1Offset * r
    ],
    [
      x2Offset * r + x1Offset * (1-r),
      y2Offset * r + y1Offset * (1-r)
    ]
  ];
}

function drawFold(ctx, point1, point2, depth) {
  const foldPoints = generateFold(point1, point2, depth);

  ctx.strokeStyle = "#bbbbbbff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(...foldPoints[0]); 
  ctx.lineTo(...foldPoints[1]); 
  ctx.lineTo(...foldPoints[2]);
  ctx.lineTo(...foldPoints[3]);
  ctx.closePath();
  ctx.stroke();
}




function drawCubeNet(ctx, parameters) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const [a, b, h] = parameters;

    const startX = 50;
    const startY = 50 + b;

    drawFold(ctx, [startX, startY],[startX+a, startY], 20);
    drawFold(ctx, [startX+a, startY],[startX+a+b, startY], 20);
    //drawFold(ctx, [startX+a+b, startY-b, startX+a+b+a, startY-b], 20);
    drawFold(ctx, [startX+a+b+a, startY],[startX+a+b+a+b, startY], 20);

    drawFold(ctx, [startX, startY+h],[startX+a, startY+h], -20);
    drawFold(ctx, [startX+a, startY+h],[startX+a+b, startY+h], -20);
    //drawFold(ctx, [startX+a+b, startY+b+h, startX+a+b+a, startY+b+h], -20);
    drawFold(ctx, [startX+a+b+a, startY+h],[startX+a+b+a+b, startY+h], -20);

    drawFold(ctx, [startX+a+b+a+b, startY],[startX+a+b+a+b, startY+h], 20);



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

function gluePoints(t0, p0, t1, p1, reverseOrder = false) {

  let shifted = translatePoints(t0, -t0[p1][0], -t0[p1][1]);

  let nextP1 = (p1 + 1) % t0.length;
  if (reverseOrder) {
    nextP1 = (p1 - 1) % t0.length;
  }
  let v0 = [
    t0[nextP1][0] - t0[p1][0],
    t0[nextP1][1] - t0[p1][1]
  ];

  let nextP0 = (p0 - 1) % t1.length;
  if (reverseOrder) {
    nextP0 = (p0 + 1) % t1.length;
  }
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

function glueObjects(object0, shape0Index, p0Index, object1, shape1Index, p1Index, reverseOrder = false) {
    const t0 = object0[shape0Index];
    const t1 = object1[shape1Index];

    let shifted = translatePoints(t0, -t0[p0Index][0], -t0[p0Index][1]);

    let nextP1 = (p0Index + 1) % t0.length;
    if (reverseOrder) {
        nextP1 = (p0Index - 1 + t0.length) % t0.length;
    }

    let v0 = [
        t0[nextP1][0] - t0[p0Index][0],
        t0[nextP1][1] - t0[p0Index][1]
    ];

    let nextP0 = (p1Index - 1 + t1.length) % t1.length;
    if (reverseOrder) {
        nextP0 = (p1Index + 1) % t1.length;
    }

    let v1 = [
        t1[nextP0][0] - t1[p1Index][0],
        t1[nextP0][1] - t1[p1Index][1]
    ];

    let angle0 = Math.atan2(v0[1], v0[0]);
    let angle1 = Math.atan2(v1[1], v1[0]);
    let rotation = angle1 - angle0;

    const rotatedObject = object0.map(points => rotatePoints(translatePoints(points, -t0[p0Index][0], -t0[p0Index][1]), rotation));
    const gluedObject = rotatedObject.map(points => translatePoints(points, t1[p1Index][0], t1[p1Index][1]));

    return gluedObject;
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

function generate3DTrapezePoints(d, e, f, g, h){

  const front_h = Math.sqrt(f*f + (e-h)/2 * (e-h)/2);
  const side_h = Math.sqrt(f*f + (d-g)/2 * (d-g)/2);

  const front = generateTrapezePoints(g, d, front_h);
  const side = generateTrapezePoints(h, e, side_h);

  const points1 = translatePoints(front, 0,0);
  const points2 = gluePoints(side, 2, points1, 3);
  const points3 = gluePoints(front, 2, points2, 3);
  const points0 = gluePoints(side, 3, points1, 2, true);

  return [points0, points1, points2, points3];
}




function drawBody(ctx, parameters) {
  
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const [a, b, c, d, e, f, g, h] = parameters;
    
    const startX = 50;
    const startY = 50;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    const upperBody = generate3DTrapezePoints(d, e, f, g, h).
      map(points => translatePoints(points, startX, startY));

    const upperRectangle = glueObjects(
      [generateTrapezePoints(g, g, h)], 0, 3,
      upperBody, 1, 0,
      true
    )

    const lowerBody = glueObjects(
      generate3DTrapezePoints(a, b, c, d, e), 1, 0,  
      upperBody, 1, 3     
    );

    let folds = [];
    for (const i of [0, 2, 3]) {
      folds.push(generateFold(upperBody[i][0],upperBody[i][1], 0.45, 10));
      folds.push(generateFold(lowerBody[i][0],lowerBody[i][1], 0.45, 10));
    }

    ctx.strokeStyle = "#bbbbbbff";
    ctx.lineWidth = 2;

    folds.forEach(points => drawPoints(ctx, points));


    ctx.strokeStyle = "#000";

    upperBody.forEach(points => drawPoints(ctx, points));
    upperRectangle.forEach(points => drawPoints(ctx, points));
    lowerBody.forEach(points => drawPoints(ctx, points));
    

}

function drawHead(ctx, parameters) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const [a, b] = parameters;
    const startX = 50;
    const startY = 50;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    
    ctx.moveTo(startX+a, startY+a/2);
    ctx.arc(a/2 + startX, a/2 + startY, a/2, 0, Math.PI * 2); 
        ctx.stroke();

    ctx.strokeStyle = "#bbbbbbff";
    ctx.lineWidth = 2;
    
    

    const points = generateFold([startX, startY + a + 40], [startX + a/2 * Math.PI, startY + a + 40], 0.1, 20);
    drawPoints(ctx, points);
    

    const points2 = generateFold([startX, startY + a + 40+b], [startX + a/2 * Math.PI, startY + a + 40+b], 0.1, -20);
    ctx.beginPath(); 
    ctx.strokeStyle = "#bbbbbbff";
    drawPoints(ctx, points2);


    for (const i of [0, 1]) {

      ctx.beginPath();

      const spacing = 5;
      const offset = (startX + a/2 * Math.PI - startX) * 0.1;

      for (let j = startX + offset; j < startX + a/2 * Math.PI - offset; j += spacing) {
        ctx.moveTo(j, startY + a + 40 + i * b);
        ctx.lineTo(j, startY + a + 40 + i * b - (i === 0 ? 20 : -20));
      }
      ctx.stroke();
    }

    

    const fold1 = generateFold([startX + a + 10, startY], [startX + a + 10 + b, startY], 0.2, 10);
    drawPoints(ctx, fold1);
    const fold2 = generateFold([startX + a + 10, startY+a], [startX + a + 10 + b, startY+a], 0.2, -10);
    drawPoints(ctx, fold2);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    

    ctx.strokeRect(startX + a + 10, startY, b, a);

    

    ctx.strokeRect(startX, startY + a + 40, a/2 * Math.PI, b);


}
