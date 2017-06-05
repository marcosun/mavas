import Polyline from './polyline';

export default class Palette {
  
  /*
    *@param {Map} map [Amap instance]
    *@param {String} type [graph type: polyline]
    *@return {Object}
    
    *palatte represents a canavas picture
  */
  constructor(map, type) {
    //TODO: palette supports only one type of graph now
    switch(type) {
      case 'polyline':
        this.__proto__.importPolyline = Polyline.importPolyline;
        this.__proto__.draw = Polyline.draw;
        this.__proto__.cacheVisiblePolyline = Polyline.cacheVisiblePolyline;
        break;
      default:
        throw new Error('Unknown type');
    };
    
    this.map = map;
    this.type = type || 'polyline';
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.map.getSize().width;
    this.canvas.height = this.map.getSize().height;
    this.ctx = this.canvas.getContext('2d');
  };
  
  setBoundLngLat() {
    let bounds, southwest, northeast;
    bounds = this.map.getBounds();
    southwest = bounds.getSouthWest();
    northeast = bounds.getNorthEast();
    this.boundLngLat = [southwest.lng, southwest.lat, northeast.lng, northeast.lat]
  };
  
  /*
    *@param {String} data [graph data: polyline point lnglat]
  */
  importData(data) {
    switch(this.type) {
      case 'polyline':
        this.importPolyline(data);
        break;
      default:
    };
  };
};