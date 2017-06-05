export default class Brush {
  
  /*
    *@param {Map} map [Amap instance]
    *@return {Object}
    
    *palatte represents a canavas picture
  */
  constructor(map) {
    this.map = map;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.map.getSize().width;
    this.canvas.height = this.map.getSize().height;
    this.ctx = this.canvas.getContext('2d');
  };
  
  draw(palettes) {
    this.ctx.save();
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    palettes.forEach((palette) => {
      palette.draw();
      this.ctx.drawImage(palette.canvas,0,0);
    });
    this.ctx.restore();
  };
  
};