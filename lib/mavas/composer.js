import Util from './util';
import Palette from './palette';

export default class Composer {
  constructor() {
    this.customLayers = [];
  };
  
  /*
    *@param {String} type [compulsory; external || polyline]
  */
  //TODO: supports config
  createLayer(outerOption) {
    let option;
    
    switch(outerOption.type) {
      case 'external':
        //this.composer.createExternalLayer(option);
        break;
      case 'polyline':
        option = {
          type: outerOption.type,
          cacheAlgo: outerOption.cacheAlgo || '9 blocks',
          delay: outerOption.delay && Util.isNumber(outerOption.delay.interval) && Util.isNumber(outerOption.delay.size) ? {interval: Number(outerOption.delay.interval), size: Number(outerOption.delay.size),} : undefined,
          data: outerOption.data || [],
          color: outerOption.color || 'black',
        };
        return this.createPalette(option);
      case 'marker':
        option = {
          type: outerOption.type,
          data: outerOption.data || [],
          color: outerOption.color || 'black',
        };
        return this.createPalette(option);
      default:
        throw new Error('unknown layer type');
    };
  };
  
  /*
    *@param {String} type [compulsory]
    *@param {String} cacheAlgo [optional: default 9 blocks]
    *@param {{interval: Number,String, size: Number,String }} delay [optional: {interval: 1000, size: 100,} default undefined]
    *@param {Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
    *@color {String} type [optional: default black]
    *@return {Palette} palette [Palette instance]
  */
  createPalette(option) {
    let palette;
    
    palette = new Palette(this.map, option);
    this.customLayers.push(palette);
    palette.importData(option.data);
    
    return palette;
  };
  
  draw(option) {
    //TODO: now supports palette only
    let customLayer,
        currentLayer;
    
    for(let i = 0, len = this.customLayers.length; i < len; i++) {
      currentLayer = this.customLayers[i];
      customLayer = new AMap.CustomLayer(currentLayer.canvas, option);
      customLayer.render = currentLayer.draw.bind(currentLayer);
      customLayer.setMap(this.map);
    };
  };
  
};