import Component from './component';
import Palette from './palette';
import Util from './util';

export default class Composer extends Component {
  constructor() {
    super();
    this.customLayers = [];
  };
  
  /*
    *@param {String} type [compulsory; external || polyline]
    *init custom layer based on layer type
  */
  createLayer(outerOptions) {
    let options, palette, paletteTooltip;
    
    switch(outerOptions.type) {
      case 'polyline':
      case 'curve':
      case 'quadraticCurve':
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
        options = {
          type: outerOptions.type,
          id: outerOptions.id,
          data: {
            location: outerOptions.data && outerOptions.data.location && outerOptions.data.location instanceof Array ? outerOptions.data.location : [],
          },
          cacheAlgo: outerOptions.cacheAlgo || '9 blocks',
          delay: outerOptions.delay && Util.isNumber(outerOptions.delay.interval) && Util.isNumber(outerOptions.delay.size) ? {interval: Number(outerOptions.delay.interval), size: Number(outerOptions.delay.size),} : undefined,
          realtime: outerOptions.realtime === true,
          color: outerOptions.color || 'black',
        };
        
        if (options.realtime === true) {
          options.delay = undefined;
        }
        return this.createPalette(options);
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
        options = {
          type: outerOptions.type,
          id: outerOptions.id,
          data: {
            location: outerOptions.data && outerOptions.data.location && outerOptions.data.location instanceof Array ? outerOptions.data.location : [],
          },
          realtime: outerOptions.realtime === true,
          onClick: outerOptions.onClick instanceof Function ? outerOptions.onClick : undefined,
        };
        
        options.data.icon = (() => {
          if (outerOptions.data) {
            switch(outerOptions.data.icon instanceof Array) {
              case true:
                switch(outerOptions.data.icon.length === options.data.location.length) {
                  case true:
                    return outerOptions.data.icon;
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
        
        return this.createPalette(options);
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
        options = {
          type: outerOptions.type,
          data: {
            location: outerOptions.data && outerOptions.data.location instanceof Array ? outerOptions.data.location : [],
            markerSize: outerOptions.data && outerOptions.data.markerSize instanceof Array ? outerOptions.data.markerSize : [],
            desc: outerOptions.data && outerOptions.data.desc instanceof Array ? outerOptions.data.desc : [],
          },
          cumulative: outerOptions.cumulative === true,
          left: typeof outerOptions.left === 'number' ? outerOptions.left : 10,
          padding: typeof outerOptions.padding === 'number' ? outerOptions.padding : 6,
          width: typeof outerOptions.width === 'number' ? outerOptions.width : 108,
          lineHeight: typeof outerOptions.lineHeight === 'number' ? outerOptions.lineHeight : 1.6,
          font: typeof outerOptions.font === 'string' ? outerOptions.font : '12px monospace',
          color: typeof outerOptions.color === 'string' ? outerOptions.color : 'white',
          backgroundColor: typeof outerOptions.backgroundColor === 'string' ? outerOptions.backgroundColor : 'rgba(0, 0, 0, 0.7)',
        };
        
        if (options.data.location.length !== options.data.markerSize.length || options.data.location.length !== options.data.desc.length) {
          throw new Error('number of location, markerSize, and desc must be identical');
        }
        
        return this.createPalette(options);
        break;
      case 'fixedLocationExternal':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [optional: html canvas tag id]
          *@param {Canvas} image [compulsory: DOM canvas element]
          *@param {[lng, lat]} center [lng: Number, lat: Number]
          *@return {Palette} palette [Palette instance]
        */
        options = {
          type: outerOptions.type,
          id: outerOptions.id,
          data: outerOptions.image,
          position: (() => {
            if (outerOptions.position instanceof Array === true) {
              //if array
              if (outerOptions.position.length === 2 && typeof outerOptions.position[0] === 'number' && typeof outerOptions.position[1] === 'number') {
                return outerOptions.position;
              };
            };
            
            throw new Error('unkown position');
          })(),
        };
        
        return this.createPalette(options);
        break;
      case 'fixedScreenExternal':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [optional: html canvas tag id]
          *@param {Canvas} image [compulsory: DOM canvas element]
          *@param {String} position [optional: default to topright]
          *@return {Palette} palette [Palette instance]
        */
        options = {
          type: outerOptions.type,
          id: outerOptions.id,
          data: outerOptions.image,
          position: (() => {
            if (typeof outerOptions.position === 'string') {
              //if string
              switch(outerOptions.position) {
                case 'top':
                case 'topright':
                case 'topleft':
                case 'right':
                case 'bottom':
                case 'bottomright':
                case 'bottomleft':
                case 'left':
                case 'center':
                  return outerOptions.position;
                  break;
                default:
                  return 'topright';
              };
            };
            
            if (outerOptions.position instanceof Array === true) {
              //if array
              if (outerOptions.position.length === 2 && typeof outerOptions.position[0] === 'number' && typeof outerOptions.position[1] === 'number') {
                return outerOptions.position;
              };
            };
            
            //default
            return 'topright';
          })(),
        };
        
        return this.createPalette(options);
        break;
      default:
        throw new Error('unknown layer type');
    };
  };
  
  createPalette(options) {
    let palette;
    
    palette = new Palette(this.map, options);
    this.customLayers.push(palette);
    palette.importData(options.data);
    
    return palette;
  };
  
  draw(options) {
    //TODO: now supports palette only
    let customLayer,
        currentLayer;
    
    for(let i = 0, len = this.customLayers.length; i < len; i++) {
      currentLayer = this.customLayers[i];
      customLayer = new AMap.CustomLayer(currentLayer.canvas, options);
      customLayer.render = currentLayer.draw.bind(currentLayer);
      customLayer.setMap(this.map);
    };
  };
  
};