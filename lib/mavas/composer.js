import Util from './util';
import Palette from './palette';

export default class Composer {
  constructor() {
    this.customLayers = [];
  };
  
  /*
    *@param {String} type [compulsory; external || polyline]
    *init custom layer based on layer type
  */
  createLayer(outerOption) {
    let option, palette;
    
    switch(outerOption.type) {
      case 'external':
        //this.composer.createExternalLayer(option);
        break;
      case 'polyline':
        /*
          *@param {String} type [compulsory]
          *@param {String} cacheAlgo [optional: default 9 blocks]
          *@param {{interval: Number,String, size: Number,String }} delay [optional: {interval: 1000, size: 100,} default undefined]
          *@param {Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
          *@color {String} color [optional: default black]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          cacheAlgo: outerOption.cacheAlgo || '9 blocks',
          delay: outerOption.delay && Util.isNumber(outerOption.delay.interval) && Util.isNumber(outerOption.delay.size) ? {interval: Number(outerOption.delay.interval), size: Number(outerOption.delay.size),} : undefined,
          data: outerOption.data || [],
          color: outerOption.color || 'black',
        };
        return this.createPalette(option);
      case 'marker':
        /*
          *@param {String} type [compulsory]
          *@param {Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
          *@color {String} color [optional: default black]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          data: outerOption.data || [],
          color: outerOption.color || 'black',
        };
        
        palette = this.createPalette(option);
        
        //init tooltip palette
        if (outerOption.tooltip) {
          //number of tooltip must equal to number of data points
          if (outerOption.tooltip.length === option.data.length) {
            this.createLayer({
              type: 'tooltip',
              data: {
                marker: option.data,
                tooltip: outerOption.tooltip,
              },
            });
          } else {
            throw new Error('tooltip length must equal to data points length');
          }
        }
        
        return palette;
      case 'tooltip':
        /*
          *@param {String} type [compulsory]
          *@param {Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
          *@color {String} color [optional: default black]
          *@return {Palette} palette [Palette instance]
        */
        option = Object.assign({}, outerOption);
        
        return this.createPalette(option);
        break;
      default:
        throw new Error('unknown layer type');
    };
  };
  
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