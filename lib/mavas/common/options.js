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
      onClick: outerOptions.onClick instanceof Function ? outerOptions.onClick : undefined,
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
      cumulative: outerOptions.cumulative === true,
      style: tooltipStyleReducer(outerOptions.style),
    };
    
    options = Object.assign({},
      options,
      {
        data: tooltipDataReducer(outerOptions.data, options),
      }
    );
    
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
  case 'infoWindow':
    options = {
      type: outerOptions.type,
      id: outerOptions.id,
      data: infoWindowDataReducer(outerOptions.data),
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
    userDefine: options.userDefine || undefined,
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
          userDefine: data[i].userDefine || undefined,
        });
      }
        
      return result;
    }
  } else {
    //if no user defined style, return default
    return [defaultConfig];
  }
};
  
const lineStyleReducer = (lineStyle) => {
  const defaultConfig = {
    type: 'line',
    lineWidth: 1,
    color: 'black',
  };
    
  if (lineStyle) {
    return {
      type: typeof lineStyle.type === 'string' ? lineStyle.type : defaultConfig.type,
      lineWidth: typeof lineStyle.lineWidth === 'number' ? lineStyle.lineWidth : defaultConfig.lineWidth,
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
    isRealtime: false,
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
    offsetX: 0,
    offsetY: 0,
  };

  let result = [];

  if(data instanceof Array) {
    for(let i = 0, len = data.length; i < len; i++) {
      const coords = data[i].coords ? data[i].coords : defaultConfig.coords,
        icon = data[i].icon ? data[i].icon : defaultConfig.icon,
        offsetX = typeof data[i].offsetX === 'number' ? data[i].offsetX : defaultConfig.offsetX,
        offsetY = typeof data[i].offsetY === 'number' ? data[i].offsetY : defaultConfig.offsetY;

      result.push({
        coords,
        icon,
        offsetX,
        offsetY,
      });
    }
    return result;
  } else {
    return [defaultConfig];
  }
};

const tooltipDataReducer = (data, options) => {
  const defaultConfig = {
    coords: [],
    width: 38,
    height: 56,
    desc: '',
    offsetX: 0,
    offsetY: 0,
    style: tooltipStyleReducer(options.style),
  };
  
  let result = [];
  
  if(data) {
    for(let i = 0, len = data.length; i < len; i++) {
      const coords = data[i].coords instanceof Array ? data[i].coords : defaultConfig.coords,
        width = data[i].width ? data[i].width : defaultConfig.width,
        height = data[i].height ? data[i].height : defaultConfig.height,
        desc = typeof data[i].desc === 'string' ? data[i].desc : defaultConfig.desc,
        offsetX = data[i].offsetX ? data[i].offsetX : defaultConfig.offsetX,
        offsetY = data[i].offsetY ? data[i].offsetY : defaultConfig.offsetY,
        style = data[i].style ? tooltipStyleReducer(data[i].style) : defaultConfig.style;
      
      result.push({
        coords,
        width,
        height,
        desc,
        offsetX,
        offsetY,
        style,
      });
    }
    return result;
  } else {
    return [defaultConfig];
  }
};

const tooltipStyleReducer = (style) => {
  const defaultConfig = {
    left: 10,
    width: 108,
    padding: 6,
    lineHeight: 1.6,
    font: '12px monospace',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  };
  
  if(style) {
    return {
      left: typeof style.left === 'number' ? style.left : defaultConfig.left,
      padding: typeof style.padding === 'number' ? style.padding : defaultConfig.padding,
      width: typeof style.width === 'number' ? style.width : defaultConfig.width,
      lineHeight: typeof style.lineHeight === 'number' ? style.lineHeight : defaultConfig.lineHeight,
      font: typeof style.font === 'string' ? style.font : defaultConfig.font,
      color: typeof style.color === 'string' ? style.color : defaultConfig.color,
      backgroundColor: typeof style.backgroundColor === 'string' ? style.backgroundColor : defaultConfig.backgroundColor,
    };
  } else {
    return defaultConfig;
  }
};

const infoWindowDataReducer = (data) => {
  const defaultConfig = {
    coords: [],
    offsetX: 0,
    offsetY: 0,
    style: infoWindowStyleReducer(),
    content: '',
  };
  
  let result = [];
  
  if(data) {
    for(let i = 0, len = data.length; i < len; i++) {
      result.push({
        coords: data[i].coords instanceof Array ? data[i].coords : defaultConfig.coords,
        offsetX: typeof data[i].offsetX === 'number' ? data[i].offsetX : defaultConfig.offsetX,
        offsetY: typeof data[i].offsetY === 'number' ? data[i].offsetY : defaultConfig.offsetY,
        style: data[i].style ? infoWindowStyleReducer(data[i].style) : defaultConfig.style,
        content: typeof data[i].content === 'string' ? data[i].content : defaultConfig.content,
      });
    }
    
    return result;
  } else {
    return [defaultConfig];
  }
};

const infoWindowStyleReducer = (style) => {
  const defaultConfig = {
    shape: 'rect',
    width: 80,
    height: 20,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: 'green',
    font: '12px monospace',
    color: 'black',
    backgroundColor: 'white',
  };
  
  if(style) {
    return {
      shape: typeof style.shape === 'string' ? style.shape : defaultConfig.shape,
      width: typeof style.width === 'number' ? style.width : defaultConfig.width,
      height: typeof style.height === 'number' ? style.height : defaultConfig.height,
      borderWidth: typeof style.borderWidth === 'number' ? style.borderWidth : defaultConfig.borderWidth,
      borderRadius: typeof style.borderRadius === 'number' ? style.borderRadius : defaultConfig.borderRadius,
      borderColor: typeof style.borderColor === 'string' ? style.borderColor : defaultConfig.borderColor,
      font: typeof style.font === 'string' ? style.font : defaultConfig.font,
      color: typeof style.color === 'string' ? style.color : defaultConfig.color,
      backgroundColor: typeof style.backgroundColor === 'string' ? style.backgroundColor : defaultConfig.backgroundColor,
    };
  } else {
    return defaultConfig;
  }
};