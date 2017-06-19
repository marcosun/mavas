import Polyline from './polyline';
import Marker from './marker';
import Tooltip from './tooltip';

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
        this.importData = Polyline.importData;
        this.draw = Polyline.draw;
        this.cacheVisiblePolyline = Polyline.cacheVisiblePolyline;
        break;
      case 'marker':
        this.importData = Marker.importData;
        this.draw = Marker.draw;
        this.cacheVisibleMarker = Marker.cacheVisibleMarker;
        break;
      case 'tooltip':
        this.importData = Tooltip.importData;
        this.draw = Tooltip.draw;
        this.cacheVisibleTooltip = Tooltip.cacheVisibleTooltip;
        break;
    };
    
    this.map = map;
    this.option = option;
    this.canvas = document.createElement('canvas');
    this.canvas.id = this.option.id;
    this.canvas.width = this.map.getSize().width;
    this.canvas.height = this.map.getSize().height;
    this.ctx = this.canvas.getContext('2d');
    this.virtualCanvas = document.createElement('canvas');
    this.virtualCanvas.width = this.map.getSize().width;
    this.virtualCanvas.height = this.map.getSize().height;
    this.virtualCtx = this.virtualCanvas.getContext('2d');
    this.isInitialLoad = undefined;
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