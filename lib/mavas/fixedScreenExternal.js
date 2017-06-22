import Util from './util';

function importImage() {
  this.canvas = this.option.data;
  this.canvas.style.position = 'absolute';
  switch(this.option.position) {
    case 'top':
      this.canvas.style.top = '0';
      this.canvas.style.left = '50%';
      this.canvas.style.transform = 'translate3d(-50%, 0, 0)';
      break;
    case 'topright':
      this.canvas.style.top = '0';
      this.canvas.style.right = '0';
      break;
    case 'topleft':
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      break;
    case 'right':
      this.canvas.style.top = '50%';
      this.canvas.style.right = '0';
      this.canvas.style.transform = 'translate3d(0, -50%, 0)';
      break;
    case 'bottom':
      this.canvas.style.bottom = '0';
      this.canvas.style.left = '50%';
      this.canvas.style.transform = 'translate3d(-50%, 0, 0)';
      break;
    case 'bottomright':
      this.canvas.style.bottom = '0';
      this.canvas.style.right = '0';
      break;
    case 'bottomleft':
      this.canvas.style.bottom = '0';
      this.canvas.style.left = '0';
      break;
    case 'left':
      this.canvas.style.top = '50%';
      this.canvas.style.left = '0';
      this.canvas.style.transform = 'translate3d(0, -50%, 0)';
      break;
    case 'center':
      this.canvas.style.top = '50%';
      this.canvas.style.left = '50%';
      this.canvas.style.transform = 'translate3d(-50%, -50%, 0)';
      break;
  };
};

function draw() {
  Util.setIsInitialLoadIndicator.call(this);
  
  if (this.isInitialLoad === true) {
    
    document.getElementsByClassName('amap-maps')[0].append(this.canvas);

  };
};

export default {
  importImage,
  draw,
}