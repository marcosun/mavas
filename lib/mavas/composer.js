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
          *@param {location, icon} data [optional: location = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; icon is array of canvases for marker icons]
          *@param {Boolean} realtime [optional: default false]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: {
            location: outerOption.data && outerOption.data.location && outerOption.data.location instanceof Array ? outerOption.data.location : [],
          },
          realtime: outerOption.realtime === true ? true : false,
        };
        
        option.data.icon = (() => {
          if (outerOption.data) {
            switch(outerOption.data.icon instanceof Array) {
              case true:
                switch(outerOption.data.icon.length === option.data.location.length) {
                  case true:
                    return outerOption.data.icon;
                    break;
                  default:
                    throw new Error('number of customised icons must equals to number of markers');
                    break;
                };
                break;
              default:
                return [];
                break;
            };
          } else {
            return [];
          }
        })();
        
        palette = this.createPalette(option);
        
        //init tooltip palette
        if (outerOption.tooltip) {
          //number of tooltip must equal to number of data points
          if (outerOption.tooltip.length === option.data.location.length) {
            paletteTooltip = this.createLayer({
              type: 'tooltip',
              data: {
                marker: option.data.location,
                tooltip: outerOption.tooltip,
              },
            });
            
            return {palette, paletteTooltip};
          } else {
            throw new Error('number of tooltips must equals to number of markers');
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
      case 'fixedLocationExternal':
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
          position: (() => {
            if (outerOption.position instanceof Array === true) {
              //if array
              if (outerOption.position.length === 2 && typeof outerOption.position[0] === 'number' && typeof outerOption.position[1] === 'number') {
                return outerOption.position;
              };
            };
            
            throw new Error('unkown position');
          })(),
        };
        
        return this.createPalette(option);
        break;
      case 'fixedScreenExternal':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [optional: html canvas tag id]
          *@param {Canvas} image [compulsory: DOM canvas element]
          *@param {String} position [optional: default to topright]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: outerOption.image,
          position: (() => {
            if (typeof outerOption.position === 'string') {
              //if string
              switch(outerOption.position) {
                case 'top':
                case 'topright':
                case 'topleft':
                case 'right':
                case 'bottom':
                case 'bottomright':
                case 'bottomleft':
                case 'left':
                case 'center':
                  return outerOption.position;
                  break;
                default:
                  return 'topright';
              };
            };
            
            if (outerOption.position instanceof Array === true) {
              //if array
              if (outerOption.position.length === 2 && typeof outerOption.position[0] === 'number' && typeof outerOption.position[1] === 'number') {
                return outerOption.position;
              };
            };
            
            //default
            return 'topright';
          })(),
        };
        
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