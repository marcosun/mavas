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
    let option, palette, paletteTooltip;
    
    switch(outerOption.type) {
      case 'external':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [optional: html canvas tag id]
          *@param {Canvas} image [compulsory: DOM canvas element]
          *@param {[lng, lat]} center [lng: Number, lat: Number]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: outerOption.image,
          center: outerOption.center,
        };
        
        return this.createPalette(option);
        break;
      case 'polyline':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [optional: html canvas tag id]
          *@param {Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
          *@param {String} cacheAlgo [optional: default 9 blocks]
          *@param {{interval: Number,String, size: Number,String }} delay [optional: {interval: 1000, size: 100,} default undefined]
          *@param {Boolean} realtime [optional: default false]
          *@param {String} color [optional: default black]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: outerOption.data || [],
          cacheAlgo: outerOption.cacheAlgo || '9 blocks',
          delay: outerOption.delay && Util.isNumber(outerOption.delay.interval) && Util.isNumber(outerOption.delay.size) ? {interval: Number(outerOption.delay.interval), size: Number(outerOption.delay.size),} : undefined,
          realtime: outerOption.realtime === true ? true : false,
          color: outerOption.color || 'black',
        };
        
        if (option.realtime === true) {
          option.delay = undefined;
        }
        return this.createPalette(option);
        break;
      case 'marker':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [optional: html canvas tag id]
          *@param {Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
          *@param {Boolean} realtime [optional: default false]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: outerOption.data || [],
          realtime: outerOption.realtime === true ? true : false,
        };
        
        palette = this.createPalette(option);
        
        //init tooltip palette
        if (outerOption.tooltip) {
          //number of tooltip must equal to number of data points
          if (outerOption.tooltip.length === option.data.length) {
            paletteTooltip = this.createLayer({
              type: 'tooltip',
              data: {
                marker: option.data,
                tooltip: outerOption.tooltip,
              },
            });
            
            return {palette, paletteTooltip};
          } else {
            throw new Error('tooltip length must equal to data points length');
          }
        }
        
        return palette;
        break;
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