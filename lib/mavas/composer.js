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
          *@param {location: Array} data [optional: location = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
          *@param {String} cacheAlgo [optional: default 9 blocks]
          *@param {{interval: Number,String, size: Number,String }} delay [optional: {interval: 1000, size: 100,} default undefined]
          *@param {Boolean} realtime [optional: default false]
          *@param {String} color [optional: default black]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: {
            location: outerOption.data && outerOption.data.location && outerOption.data.location instanceof Array ? outerOption.data.location : [],
          },
          cacheAlgo: outerOption.cacheAlgo || '9 blocks',
          delay: outerOption.delay && Util.isNumber(outerOption.delay.interval) && Util.isNumber(outerOption.delay.size) ? {interval: Number(outerOption.delay.interval), size: Number(outerOption.delay.size),} : undefined,
          realtime: outerOption.realtime === true,
          color: outerOption.color || 'black',
        };
        
        if (option.realtime === true) {
          option.delay = undefined;
        }
        return this.createPalette(option);
        break;
      case 'curve':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [optional: html canvas tag id]
          *@param {location: Array} data [optional: location = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number]
          *@param {String} cacheAlgo [optional: default 9 blocks]
          *@param {{interval: Number,String, size: Number,String }} delay [optional: {interval: 1000, size: 100,} default undefined]
          *@param {Boolean} realtime [optional: default false]
          *@param {String} color [optional: default black]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: {
            location: outerOption.data && outerOption.data.location && outerOption.data.location instanceof Array ? outerOption.data.location : [],
          },
          cacheAlgo: outerOption.cacheAlgo || '9 blocks',
          delay: outerOption.delay && Util.isNumber(outerOption.delay.interval) && Util.isNumber(outerOption.delay.size) ? {interval: Number(outerOption.delay.interval), size: Number(outerOption.delay.size),} : undefined,
          realtime: outerOption.realtime === true,
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
          *@param {Function} onClick [optional: click callback]
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          id: outerOption.id,
          data: {
            location: outerOption.data && outerOption.data.location && outerOption.data.location instanceof Array ? outerOption.data.location : [],
          },
          realtime: outerOption.realtime === true,
          onClick: outerOption.onClick instanceof Function ? outerOption.onClick : undefined,
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
        
        return this.createPalette(option);
        break;
      case 'tooltip':
        /*
          *@param {String} type [compulsory]
          *@param {location: Array, markerSize: [width, height], desc: [String]} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; markerSize = [{width: Number, height: Number}], desc: [String, String]]
          *@param {Boolean} cumulative [optional: default false]
          *@param {Number} left [optional: left margin, default to 10px]
          *@param {Number} padding [optional: default to 6px]
          *@param {Number} width [optional: width of context, default to 108px]
          *@param {Number} lineHeight [optional: default to 1.6]
          *@param {String} font [optional: default to '12px monospace']
          *@param {String} color [optional: font color, default to 'white']
          *@param {String} backgroundColor [optional: default to 'rgba(0, 0, 0, 0.7)']
          *@return {Palette} palette [Palette instance]
        */
        option = {
          type: outerOption.type,
          data: {
            location: outerOption.data && outerOption.data.location instanceof Array ? outerOption.data.location : [],
            markerSize: outerOption.data && outerOption.data.markerSize instanceof Array ? outerOption.data.markerSize : [],
            desc: outerOption.data && outerOption.data.desc instanceof Array ? outerOption.data.desc : [],
          },
          cumulative: outerOption.cumulative === true,
          left: typeof outerOption.left === 'number' ? outerOption.left : 10,
          padding: typeof outerOption.padding === 'number' ? outerOption.padding : 6,
          width: typeof outerOption.width === 'number' ? outerOption.width : 108,
          lineHeight: typeof outerOption.lineHeight === 'number' ? outerOption.lineHeight : 1.6,
          font: typeof outerOption.font === 'string' ? outerOption.font : '12px monospace',
          color: typeof outerOption.color === 'string' ? outerOption.color : 'white',
          backgroundColor: typeof outerOption.backgroundColor === 'string' ? outerOption.backgroundColor : 'rgba(0, 0, 0, 0.7)',
        };
        
        if (option.data.location.length !== option.data.markerSize.length || option.data.location.length !== option.data.desc.length) {
          throw new Error('number of location, markerSize, and desc must be identical');
        }
        
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