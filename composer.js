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
    *@return {Palette}   palette [Palette instance]
  */
  createPalette() {
    let palette;
    palette = new Palette(this.map, 'polyline');
    this.customLayers.push(palette);
    
    return palette;
  };
  
  draw() {
    //TODO: now supports palette only
    this.customLayers.forEach((layer) => {
      let customLayer;
      customLayer = new AMap.CustomLayer(layer.canvas);
      customLayer.render = layer.draw.bind(layer);
      customLayer.setMap(this.map);
    });
  };
  
};