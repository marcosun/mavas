import Util from '../util';

export default function transformOptions(outerOptions) {
  let options;
  
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
      *@param {type: String, color: String} lineStyle [optional: type = ['line', 'dash'], color = 'black']
      *@return {Palette} palette [Palette instance]
    */
    options = {
      type: outerOptions.type,
      id: outerOptions.id,
      algo: algoReducer(outerOptions.algo),
      lineStyle: lineStyleReducer(outerOptions.lineStyle),
    };

    options = Object.assign({},
      options,
      {
        data: lineDataReducer(outerOptions.data, options),
      }
    );

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
      data: markerDataReducer(outerOptions.data),
      algo: algoReducer(outerOptions.algo),
      onClick: outerOptions.onClick instanceof Function ? outerOptions.onClick : undefined,
    };

    break;
  case 'tooltip':
    /*
      *@param {String} type [compulsory]
      *@param {coords: Array, size: [width, height], desc: [String]} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; size = [{width: Number, height: Number}], desc: [String, String]]
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
      id: outerOptions.id,
      data: tooltipDataReducer(outerOptions.data),
      style: tooltipStyleReducer(outerOptions.style),
      cumulative: outerOptions.cumulative === true,
    };
    
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
          }
        }

        throw new Error('unkown position');
      })(),
    };

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
          default:
            return 'topright';
          }
        }

        if (outerOptions.position instanceof Array === true) {
          //if array
          if (outerOptions.position.length === 2 && typeof outerOptions.position[0] === 'number' && typeof outerOptions.position[1] === 'number') {
            return outerOptions.position;
          }
        }

        //default
        return 'topright';
      })(),
    };
    
    break;
  default:
    throw new Error('unknown layer type');
  }
  return options;
}

/*
  *Private Properties / Functions
*/
  
const lineDataReducer = (data, options) => {
  const defaultConfig = {
    coords: [],
    symbol: symbolReducer(options.symbol),
    lineStyle: lineStyleReducer(options.lineStyle),
  };
    
  let result = [];
    
  if (data instanceof Array) {
    if (data[0] instanceof Array) {
      //coords only
      for(let i = 0, len = data.length; i < len; i++) {
        result.push(Object.assign(
          {},
          defaultConfig,
          {
            coords: data[i],
          }
        ));
      }
        
      return result;
    } else {
      //coords with styles and many more properties for each line
      for(let i = 0, len = data.length; i < len; i++) {
        result.push({
          coords: data[i].coords,
          symbol: data[i].symbol ? symbolReducer(data[i].symbol) : defaultConfig.symbol,
          lineStyle: data[i].lineStyle ? lineStyleReducer(data[i].lineStyle) : defaultConfig.lineStyle,
        });
      }
        
      return result;
    }
  } else {
    //if no user defined style, return default
    return defaultConfig;
  }
};
  
const lineStyleReducer = (lineStyle) => {
  const defaultConfig = {
    type: 'line',
    color: 'black',
  };
    
  if (lineStyle) {
    return {
      type: typeof lineStyle.type === 'string' ? lineStyle.type : defaultConfig.type,
      color: typeof lineStyle.color === 'string' ? lineStyle.color : defaultConfig.color,
    };
  } else {
    //if no user defined style, return default
    return defaultConfig;
  }
};

const algoReducer = (algo) => {
  const defaultConfig = {
    cacheAlgo: '9 blocks',
    delay: delayReducer(),
    isRealtime: true,
  };
    
  if (algo) {
    return {
      cacheAlgo: typeof algo.cacheAlgo === 'string' ? algo.cacheAlgo : defaultConfig.cacheAlgo,
      delay: algo.isRealtime === true ? delayReducer() : delayReducer(algo.delay),
      isRealtime: algo.isRealtime === true,
    };
  } else {
    //if no user defined algo, return default
    return defaultConfig;
  }
};

const delayReducer = (delay) => {
  const defaultConfig = {
    interval: undefined,
    size: undefined,
  };
    
  if (delay) {
    return {
      interval: Util.isNumber(delay.interval) ? Number(delay.interval) : defaultConfig.interval,
      size: Util.isNumber(delay.size) ? Number(delay.size) : defaultConfig.size,
    };
  } else {
    //if no user defined algo, return default
    return defaultConfig;
  }
};
  
const symbolReducer = (symbol) => {
  const defaultConfig = {
    symbol: ['none', 'none'],
    size: [10, 10],
    color: 'black',
  };
    
  let symbolName, size, color;
    
  if (symbol) {
    if (symbol.symbol instanceof Array && symbol.symbol.length === 2) {
      symbolName = symbol.symbol;
    } else {
      symbolName = defaultConfig.symbol;
    }
      
    if (symbol.size instanceof Array && symbol.size.length === 2) {
      size = symbol.size;
    } else {
      size = defaultConfig.size;
    }
      
    if (typeof symbol.color === 'string') {
      color = symbol.color;
    } else {
      color = defaultConfig.color;
    }
  } else {
    //if no user defined symbol, return default
    return defaultConfig;
  }
    
  return Object.assign(
    {},
    defaultConfig,
    {
      symbol: symbolName,
      size: size,
      color: color,
    }
  );
};
  
const markerDataReducer = (data) => {
  const defaultConfig = {
    coords: [],
    icon: undefined,
  };

  let result = [];

  if(data instanceof Array) {
    for(let i = 0, len = data.length; i < len; i++) {
      const coords = data[i].coords ? data[i].coords : defaultConfig.coords,
        icon = data[i].icon ? data[i].icon : defaultConfig.icon;

      result.push({
        coords,
        icon,
      });
    }
    return result;
  } else {
    return defaultConfig;
  }
};

const tooltipDataReducer = (data) => {
  const defaultConfig = {
    coords: [],
    size: {
      width: 19,
      height: 33,
    },
    desc: '',
  };
  
  let result = [];
  
  if(data) {
    for(let i = 0, len = data.length; i < len; i++) {
      const coords = data[i].coords instanceof Array ? data[i].coords : defaultConfig.coords,
        size = data[i].size ? data[i].size : defaultConfig.size,
        desc = typeof data[i].desc === 'string' ? data[i].desc : defaultConfig.desc;

      result.push({
        coords,
        size,
        desc,
      });
    }
    return result;
  } else {
    return defaultConfig;
  }
};

const tooltipStyleReducer = (style) => {
  const defaultConfig = {
    left: 10,
    padding: 6,
    width: 108,
    lineHeight: 1.6,
    font: '12px monospace',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  };
  
  if(style) {
    return {
      left: typeof style.left === 'number' ? style.left : 10,
      padding: typeof style.padding === 'number' ? style.padding : 6,
      width: typeof style.width === 'number' ? style.width : 108,
      lineHeight: typeof style.lineHeight === 'number' ? style.lineHeight : 1.6,
      font: typeof style.font === 'string' ? style.font : '12px monospace',
      color: typeof style.color === 'string' ? style.color : 'white',
      backgroundColor: typeof style.backgroundColor === 'string' ? style.backgroundColor : 'rgba(0, 0, 0, 0.7)',
    };
  } else {
    return defaultConfig;
  }
};