import Composer from './composer';

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
  
};