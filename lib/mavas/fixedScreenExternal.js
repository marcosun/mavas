import Util from './util';

function importImage() {
  this.canvas = this.option.data;
  this.canvas.style.position = 'absolute';
  if (typeof this.option.position === 'string') {
    //position keyword
    /*
      *WARNING: be aware to use right && bottom
      *.amap-custom {top: 0; left: 0;} from amap css library will overwrite right && bottom styles
    */
    switch(this.option.position) {
      case 'top':
        this.canvas.style.top = '0';
        this.canvas.style.left = '50%';
        this.canvas.style.transform = 'translate3d(-50%, 0, 0)';
        break;
      case 'topright':
        this.canvas.style.top = '0';
        this.canvas.style.left = '100%';
        this.canvas.style.transform = 'translate3d(-100%, 0, 0)';
        break;
      case 'topleft':
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        break;
      case 'right':
        this.canvas.style.top = '50%';
        this.canvas.style.left = '100%';
        this.canvas.style.transform = 'translate3d(-100%, -50%, 0)';
        break;
      case 'bottom':
        this.canvas.style.top = '100%';
        this.canvas.style.left = '50%';
        this.canvas.style.transform = 'translate3d(-50%, -100%, 0)';
        break;
      case 'bottomright':
        this.canvas.style.top = '100%';
        this.canvas.style.left = '100%';
        this.canvas.style.transform = 'translate3d(-100%, -100%, 0)';
        break;
      case 'bottomleft':
        this.canvas.style.top = '100%';
        this.canvas.style.left = '0';
        this.canvas.style.transform = 'translate3d(0, -100%, 0)';
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
  } else {
    //position in pixcel
    this.canvas.style.top = `${this.option.position[0].toString()}px`;
    this.canvas.style.left = `${this.option.position[1].toString()}px`;
  }
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