import Util from '../util';
import importData from './common/importData';
import {default as cacheVisibleInfoWindow} from './common/cacheAlgo';

function draw(isForceRedraw) {
  const drawBackground = (topLeftPixel, shape, width, height, lineWidth, radius, color) => {
    this.ctx.fillStyle = color;
    
    switch(shape) {
    case 'rect':
      this.ctx.fillRect(topLeftPixel.x, topLeftPixel.y, width, height);
      break;
    case 'roundRect':
      drawRoundRect('background', topLeftPixel, shape, width, height, lineWidth, radius);
      break;
    }
  };
  
  const drawBorder = (topLeftPixel, shape, width, height, lineWidth, radius, color) => {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    
    switch(shape) {
    case 'rect':
      this.ctx.strokeRect(topLeftPixel.x, topLeftPixel.y, width, height);
      break;
    case 'roundRect':
      drawRoundRect('border', topLeftPixel, shape, width, height, lineWidth, radius);
      break;
    }
  };
  
  const drawRoundRect = (type, topLeftPixel, shape, width, height, lineWidth, radius) => {
    const horizontalLineLength = width - 2 * lineWidth - 2 * radius;
    const verticalLineLength = height - 2 * lineWidth - 2 * radius;
    const pointA = {
      x: topLeftPixel.x + lineWidth + radius,
      y: topLeftPixel.y + lineWidth / 2,
    };
    const pointB = {
      x: pointA.x + horizontalLineLength,
      y: pointA.y,
    };
    const pointC = {
      x: pointB.x + lineWidth / 2 + radius,
      y: pointB.y + lineWidth / 2 + radius,
    };
    const pointD = {
      x: pointC.x,
      y: pointC.y + verticalLineLength,
    };
    const pointE = {
      x: pointD.x - lineWidth / 2 - radius,
      y: pointD.y + lineWidth / 2 + radius,
    };
    const pointF = {
      x: pointE.x - horizontalLineLength,
      y: pointE.y,
    };
    const pointG = {
      x: pointF.x - lineWidth / 2 - radius,
      y: pointF.y - lineWidth / 2 - radius,
    };
    const pointH = {
      x: pointG.x,
      y: pointG.y - verticalLineLength,
    };
    const controllPointA = {
      x: pointB.x + lineWidth / 2 + radius,
      y: pointB.y,
    };
    const controllPointB = {
      x: pointD.x,
      y: pointD.y + lineWidth / 2 + radius,
    };
    const controllPointC = {
      x: pointF.x - lineWidth / 2 - radius,
      y: pointF.y,
    };
    const controllPointD = {
      x: pointH.x,
      y: pointH.y - lineWidth / 2 - radius,
    };

    this.ctx.beginPath();
    this.ctx.moveTo(pointA.x, pointA.y);
    this.ctx.lineTo(pointB.x, pointB.y);
    this.ctx.quadraticCurveTo(controllPointA.x, controllPointA.y, pointC.x, pointC.y);
    this.ctx.lineTo(pointD.x, pointD.y);
    this.ctx.quadraticCurveTo(controllPointB.x, controllPointB.y, pointE.x, pointE.y);
    this.ctx.lineTo(pointF.x, pointF.y);
    this.ctx.quadraticCurveTo(controllPointC.x, controllPointC.y, pointG.x, pointG.y);
    this.ctx.lineTo(pointH.x, pointH.y);
    this.ctx.quadraticCurveTo(controllPointD.x, controllPointD.y, pointA.x, pointA.y);
    
    switch(type) {
    case 'background':
      this.ctx.fill();
      break;
    case 'border':
      this.ctx.stroke();
      break;
    }
  };
  
  const drawContent = (content, topLeftPixel, width, height, font, fontSize, color) => {
    const contentLength = content.length,
      contentWidth = contentLength * fontSize,
      contentHeight = fontSize,
      paddingLeft = (width - contentWidth) / 2,
      paddingTop = (height - contentHeight) / 2,
      contentToLeft = paddingLeft,
      contentToTop = height - paddingTop - 1;//vertically centrally aligned
    
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(content, topLeftPixel.x + contentToLeft, topLeftPixel.y + contentToTop);
  };
  
  const clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  
  const init = () => {
    Util.setIsInitialLoadIndicator.call(this);

    //cache visible data
    this.setBoundLngLat();
    this.cacheVisibleInfoWindow();

    clearCanvas();

    for(let i = 0, len = this.infoWindow.cache.length; i < len; i++) {
      const currentInfoWindow = this.infoWindow.cache[i];
      
      drawBackground({x: currentInfoWindow.boundPixel[0], y: currentInfoWindow.boundPixel[1]}, currentInfoWindow.style.shape, currentInfoWindow.style.width, currentInfoWindow.style.height, currentInfoWindow.style.borderWidth, currentInfoWindow.style.borderRadius, currentInfoWindow.style.backgroundColor);
      
      drawBorder({x: currentInfoWindow.boundPixel[0], y: currentInfoWindow.boundPixel[1]}, currentInfoWindow.style.shape, currentInfoWindow.style.width, currentInfoWindow.style.height, currentInfoWindow.style.borderWidth, currentInfoWindow.style.borderRadius, currentInfoWindow.style.borderColor);
      
      drawContent(currentInfoWindow.content, {x: currentInfoWindow.boundPixel[0], y: currentInfoWindow.boundPixel[1]}, currentInfoWindow.style.width, currentInfoWindow.style.height, currentInfoWindow.style.font, currentInfoWindow.style.fontSize, currentInfoWindow.style.borderColor);
    }
  };
  
  init();
}

export default {
  importData,
  draw,
  cacheVisibleInfoWindow,
};