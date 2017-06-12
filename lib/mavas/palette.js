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
        this.__proto__.importData = Polyline.importData;
        this.__proto__.draw = Polyline.draw;
        this.__proto__.cacheVisiblePolyline = Polyline.cacheVisiblePolyline;
        break;
      case 'marker':
        this.__proto__.importData = Marker.importData;
        this.__proto__.draw = Marker.draw;
//        this.__proto__.cacheMarker = Marker.cacheMarker;
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
  
};