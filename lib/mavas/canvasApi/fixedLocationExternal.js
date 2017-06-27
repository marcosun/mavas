import Util from '../util';

let isDragging = false;
/*
  *@param {Canvas} image [DOM canvas element]
*/
function importImage(image) {
  this.virtualCanvas = image;
};

function updateImage(image) {
  this.virtualCanvas = image;
  this.draw();
};

function draw() {
  let pixel, lnglat;
  
  Util.setIsInitialLoadIndicator.call(this);
  
  lnglat = new AMap.LngLat(this.option.position[0], this.option.position[1]);
  pixel = this.map.lngLatToContainer(lnglat);
  
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.drawImage(this.virtualCanvas, pixel.x - this.virtualCanvas.width / 2, pixel.y - this.virtualCanvas.height / 2);
  
  if (this.isInitialLoad === true) {
    this.map.on('dragstart', (e) => {
      isDragging = true;
    });
    
    this.map.on('dragend', (e) => {
      isDragging = false;
    });
    
  } else {
    if (isDragging) {
      Util.offsetCanvasPositionOnDrag(document.getElementById(this.option.id).parentNode);
    } else {
      try {
        Util.resetCanvasPositionAfterDrag(document.getElementById(this.option.id).parentNode);
      } catch(e) {};
    }
  }
  
  
};

export default {
  importImage,
  updateImage,
  draw,
}