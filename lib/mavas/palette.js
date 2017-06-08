import Polyline from './polyline';

export default class Palette {
  
  /*
    *@param {Map} map [Amap instance]
    *@param {Object} option []
    *@return {Object}
    
    *palatte represents a canavas picture
  */
  constructor(map, option) {
    //TODO: palette supports only one type of graph now
    switch(option.type) {
      case 'polyline':
        this.__proto__.importPolyline = Polyline.importPolyline;
        this.__proto__.draw = Polyline.draw;
        this.__proto__.cacheVisiblePolyline = Polyline.cacheVisiblePolyline;
        break;
    };
    
    this.map = map;
    this.option = option;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.map.getSize().width;
    this.canvas.height = this.map.getSize().height;
    this.ctx = this.canvas.getContext('2d');
  };
  
  setBoundLngLat() {
    let bounds, southwest, northeast;
    
    bounds = this.map.getBounds();
    northeast = bounds.getNorthEast();
    southwest = bounds.getSouthWest();
    this.boundLngLat = [northeast.lng, northeast.lat, southwest.lng, southwest.lat]
  };
  
  setCentreLngLat() {
    let centre;
    
    centre = this.map.getCenter();
    this.centreLngLat = [centre.lng, centre.lat];
  };
  
  /*
    *@param {String} data [graph data: polyline point lnglat]
  */
  importData(data) {
    switch(this.option.type) {
      case 'polyline':
        this.importPolyline(data);
        break;
      default:
    };
  };
};