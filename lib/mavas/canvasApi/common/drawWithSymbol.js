export default function drawWithSymbol(ctx, symbol, startPoint, endPoint) {
  const symbolCanvas = document.createElement('canvas'),
        symbolCtx = symbolCanvas.getContext('2d'),
        //transform canvas coordinate to ordinary coordinate
        //i.e. (1, -1) in canvas === (1, 1) in ordinary coordinate
        transformedStartPoint = Object.assign(
          {},
          startPoint,
          {
            y: -startPoint.y,
          },
        ),
        transformedEndPoint = Object.assign(
          {},
          endPoint,
          {
            y: -endPoint.y,
          },
        );
  
  symbolCanvas.width = symbol.size[0] * 2;
  symbolCanvas.height = symbol.size[1] * 2;
  
  const padding = symbol.size[0] / 2,
        centre = {
          x: symbol.size[0],
          y: symbol.size[1],
        };
  
  symbolCtx.fillStyle = symbol.color;
  
  setCentre(symbolCtx, centre);
  rotate(symbolCtx, transformedStartPoint, transformedEndPoint);
  resetCentre(symbolCtx, centre);
  symbolCtx.beginPath();
  symbolCtx.moveTo(padding, padding);
  symbolCtx.lineTo(symbol.size[0] + padding, symbol.size[0] / 2 + padding);
  symbolCtx.lineTo(padding, symbol.size[0] + padding);
  symbolCtx.closePath();
  symbolCtx.fill();
  
  if (symbol.symbol[0] === 'arrow') {
    ctx.drawImage(symbolCanvas, startPoint.x - centre.x * 2, startPoint.y - centre.y);
  }
  
  if (symbol.symbol[1] === 'arrow') {
    ctx.drawImage(symbolCanvas, endPoint.x - centre.x, endPoint.y - centre.y);
  }
};

const setCentre = (ctx, centre) => {
  ctx.translate(centre.x, centre.y);
};

const resetCentre = (ctx, centre) => {
  ctx.translate(-centre.x, -centre.y);
};

const rotate = (ctx, startPoint, endPoint) => {
  let angle = getRotateAngle(startPoint, endPoint);
  
  //angle in ordinary coordinate equal to negative angle in canvas coordinate
  //i.e. 10 degree in ordinary coordinate === -10 degree in canvas coordinate
  angle = -angle;
  
  //1. if start point is on the LHS of end point => rotate angle normally
  if (startPoint.x < endPoint.x) {
    return ctx.rotate(angle);
  }
  
  //2. if start point is on the RHS of end point => rotate angle - 180 degree
  if (startPoint.x > endPoint.x) {
    return ctx.rotate(angle - Math.PI);
  }
  
  //3. if start point is on the top of end point => rotate normally
  if (startPoint.y > endPoint.y) {
    return ctx.rotate(angle);
  }
  
  //4. if start point is on the bottom of end point => rotate angle - 180 degree
  if (startPoint.y < endPoint.y) {
    return ctx.rotate(angle - Math.PI);
  }
};

const getRotateAngle = (startPoint, endPoint) => {
  const angle = Math.atan(getSlop(startPoint, endPoint));
  
  return angle;
};

const getSlop = (startPoint, endPoint) => {
  return (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
};