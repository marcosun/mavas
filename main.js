import Composer from './composer';
import Brush from './brush';
import Palette from './palette';

/*
  *Mavas - Build Your Canvas on Amap
*/
export default class Mavas extends Composer {
  
  /*
    *initialise object
    *@param  {String}    selector  [canvas id]
    *@param  {Object}    options   [Amap init options]
    *@return {Object}
    
    *canvas is composed of palettes
  */
  constructor(selector, options) {
    super();
    this.map = new AMap.Map(selector, options);
    this.customLayer = null;
    this.brush = new Brush(this.map);
    this.palettes = [];
    console.log(this);
  };
  
  createLayer() {
    this.composer.addLayer();
  };
  
  /*
    *@return {Palette}   palette [Palette instance]
  */
  createPalette() {
    let palette;
    palette = new Palette(this.map, 'polyline');
    this.palettes.push(palette);
    
    return palette;
  };
  
  draw(options) {
    this.brush.draw(this.palettes);
    this.customLayer = new AMap.CustomLayer(this.brush.canvas, options);
    this.customLayer.render = this.brush.draw.bind(this.brush, this.palettes);
    this.customLayer.setMap(this.map);
  };
  
};