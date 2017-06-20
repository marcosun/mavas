import Composer from './composer';
import util from './util';

/*
  *Mavas - Build Your Canvas on Amap
*/
export default class Mavas extends Composer {
  
  /*
    *initialise object
    *@param {String} selector [canvas id]
    *@param {Object} options [Amap init options]
    *@return {Object}
  */
  constructor(selector, options) {
    super();
    this.map = new AMap.Map(selector, options);
  };
  
  /*
    *set correct centre and zoom to cover all data points of a particular palette
    *@param {Palette} palette [palette object]
  */
  setFit(palette) {
    let type;
    
    switch(palette.option.type) {
      case 'polyline':
        type = 'polyline';
        break;
      case 'marker':
        type = 'marker';
        break;
      default:
        throw new Error('unkown palette');
    };
    
    let data = Util.pluck(palette[type].original, 'data'),
        lngArray = Util.pluck(data, '0'),
        latArray = Util.pluck(data, '1'),
        lngMax = Math.max.apply(null, lngArray),
        lngMin = Math.min.apply(null, lngArray),
        latMax = Math.max.apply(null, latArray),
        latMin = Math.min.apply(null, latArray),
        northEast = new AMap.LngLat(lngMax, latMax),
        southWest = new AMap.LngLat(lngMin, latMin),
        bounds = new AMap.Bounds(southWest, northEast);

    this.map.setBounds(bounds);    
  };
  
};

export const Util = util;