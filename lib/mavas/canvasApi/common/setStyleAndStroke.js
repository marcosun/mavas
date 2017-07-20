export default function setStyleAndStroke(ctx, lineStyle) {
  const type = lineStyle.type,
        color = lineStyle.color;
  
  ctx.save();
  
  //line type
  if (type === 'line') {
    
  }
  if (type === 'dash') {
    ctx.setLineDash([3, 5]);
  }
  
  //line color
  ctx.strokeStyle = color;
  
  //stroke
  ctx.stroke();
  
  //restore
  ctx.restore();
};