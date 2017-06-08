import Palette from './palette';

export default class Composer {
  constructor() {
    this.customLayers = [];
  };
  
  /*
    *@param {String} type [external || palette; palette by default]
  */
  //TODO: supports config
  createLayer(type) {
    switch(type) {
      case 'external':
        //this.composer.createExternalLayer();
        break;
      case 'palette':
      default:
        return this.createPalette();
    };
  };
  
  /*
    *@return {Palette} palette [Palette instance]
  */
  createPalette() {
    let palette;
    palette = new Palette(this.map, 'polyline');
    this.customLayers.push(palette);
    
    return palette;
  };
  
  draw() {
    //TODO: now supports palette only
    let customLayer,
        currentLayer,
        i = 0,
        len = this.customLayers.length;
    
    while(i < len) {
      currentLayer = this.customLayers[i];
      customLayer = new AMap.CustomLayer(currentLayer.canvas);
      customLayer.render = currentLayer.draw.bind(currentLayer);
      customLayer.setMap(this.map);
      i ++;
    };
  };
  
};