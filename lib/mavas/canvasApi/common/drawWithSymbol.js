export default function drawWithSymbol(ctx, symbol, startPoint, endPoint) {
  const symbolCanvas = document.createElement('canvas'),
        symbolCtx = symbolCanvas.getContext('2d');
  
  symbolCanvas.width = symbol.size[0] * 2;
  symbolCanvas.height = symbol.size[1] * 2;
  
  const padding = symbol.size[0] / 2,
        centre = {
          x: symbol.size[0],
          y: symbol.size[1],
        };
  
  symbolCtx.fillStyle = symbol.color;
  
  setCentre(symbolCtx, centre);
  rotate(symbolCtx, startPoint, endPoint);
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
  const angle = getRotateAngle(startPoint, endPoint);
  
  ctx.rotate(angle);
};

const getRotateAngle = (startPoint, endPoint) => {
  const angle = Math.atan(getSlop(startPoint, endPoint));
  
  return angle;
};

const getSlop = (startPoint, endPoint) => {
  return (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
};