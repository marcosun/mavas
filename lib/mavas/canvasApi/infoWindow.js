import Util from '../util';
import importData from './common/importData';
import {default as cacheVisibleInfoWindow} from './common/cacheAlgo';

function draw(isForceRedraw) {
  const drawBackground = (topLeftPixel, width, height, color) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(topLeftPixel.x, topLeftPixel.y, width, height);
  };
  
  const drawBorder = (topLeftPixel, width, height, color) => {
    this.ctx.strokeStyle = color;
    this.ctx.strokeRect(topLeftPixel.x, topLeftPixel.y, width, height);
  };
  
  const drawContent = (content, topLeftPixel, width, height, font, fontSize, color) => {
    const contentLength = content.length,
      contentWidth = contentLength * fontSize,
      contentHeight = fontSize,
      paddingLeft = (width - contentWidth) / 2,
      paddingTop = (height - contentHeight) / 2,
      contentToLeft = paddingLeft,
      contentToTop = height - paddingTop;
    
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
      
      drawBackground({x: currentInfoWindow.boundPixel[0], y: currentInfoWindow.boundPixel[1]}, currentInfoWindow.style.width, currentInfoWindow.style.height, currentInfoWindow.style.backgroundColor);
      
      drawBorder({x: currentInfoWindow.boundPixel[0], y: currentInfoWindow.boundPixel[1]}, currentInfoWindow.style.width, currentInfoWindow.style.height, currentInfoWindow.style.borderColor);
      
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