/**
  * Mavas - Build Your Canvas on Amap
*/

import Composer from './composer';
import util from './util';

/**
 * Mavas
 * @module Mavas
 * @namespace Mavas
 * @extends Composer
 * @desc Class representing Mavas -- a canvas api integrating Amap
 */
export default class Mavas extends Composer {
  
  /**
   * Mavas constructor
   * @param  {string} selector Dom id, i.e. <div id='map'></div>, selector = 'map';
   * @param  {Object} options  Options passed to Amap.Map constructor
   */
  constructor(selector, options) {
    super();
    this.map = new window.AMap.Map(selector, options);
  }
  
  /*
    *set correct centre and zoom to cover all data points of a particular palette
    *@param {Palette} palette [palette object]
  */
  setFit(palette) {
    let type,
      lnglat,
      lngArray,
      latArray;
    
    switch(palette.options.type) {
    case 'polyline':
      type = 'polyline';
      lnglat = util.pluck(palette[type].original, 'lnglat').reduce((total, item) => {return total.concat(item)}, []);
      lngArray = util.pluck(lnglat, 'lng');
      latArray = util.pluck(lnglat, 'lat');
      break;
    case 'marker':
      type = 'marker';
      lnglat = util.pluck(palette[type].original, 'lnglat');
      lngArray = util.pluck(lnglat, 'lng');
      latArray = util.pluck(lnglat, 'lat');
      break;
    default:
      throw new Error('unkown palette');
    }

    let lngMax = Math.max.apply(null, lngArray),
      lngMin = Math.min.apply(null, lngArray),
      latMax = Math.max.apply(null, latArray),
      latMin = Math.min.apply(null, latArray),
      northEast = new window.AMap.LngLat(lngMax, latMax),
      southWest = new window.AMap.LngLat(lngMin, latMin),
      bounds = new window.AMap.Bounds(southWest, northEast);

    this.map.setBounds(bounds);
  }
  
}

export const Util = util;