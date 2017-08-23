import Polyline from './canvasApi/polyline';
import Curve from './canvasApi/curve';
import QuadraticCurve from './canvasApi/quadraticCurve';
import Marker from './canvasApi/marker';
import Tooltip from './canvasApi/tooltip';
import FixedLocationExternal from './canvasApi/fixedLocationExternal';
import FixedScreenExternal from './canvasApi/fixedScreenExternal';
import InfoWindow from './canvasApi/infoWindow';
import updatePalette from './common/updatePalette.js';

export default class Palette {
  
  /*
    *@param {Map} map [Amap instance]
    *@param {Object} options []
    *@return {Object}
    
    *palatte represents a canavas picture
  */
  constructor(map, options) {
    switch(options.type) {
    case 'polyline':
      this.updatePalette = updatePalette;
      this.import = Polyline.importData;
      this.draw = Polyline.draw;
      this.cacheVisiblePolyline = Polyline.cacheVisiblePolyline;
      break;
    case 'curve':
      this.import = Curve.importData;
      this.draw = Curve.draw;
      this.cacheVisiblePolyline = Curve.cacheVisiblePolyline;
      break;
    case 'quadraticCurve':
      this.import = QuadraticCurve.importData;
      this.draw = QuadraticCurve.draw;
      this.cacheVisiblePolyline = QuadraticCurve.cacheVisiblePolyline;
      break;
    case 'marker':
      this.updatePalette = updatePalette;
      this.import = Marker.importData;
      this.draw = Marker.draw;
      this.cacheVisibleMarker = Marker.cacheVisibleMarker;
      break;
    case 'tooltip':
      this.updatePalette = updatePalette;
      this.import = Tooltip.importData;
      this.draw = Tooltip.draw;
      this.cacheVisibleTooltip = Tooltip.cacheVisibleTooltip;
      break;
    case 'fixedLocationExternal':
      this.import = FixedLocationExternal.importImage;
      this.draw = FixedLocationExternal.draw;
      this.update = FixedLocationExternal.updateImage;
      break;
    case 'fixedScreenExternal':
      this.import = FixedScreenExternal.importImage;
      this.draw = FixedScreenExternal.draw;
      break;
    case 'infoWindow':
      this.updatePalette = updatePalette;
      this.import = InfoWindow.importData;
      this.draw = InfoWindow.draw;
      this.cacheVisibleInfoWindow = InfoWindow.cacheVisibleInfoWindow;
      break;
    }
    
    this.map = map;
    this.options = options;
    this.canvas = document.createElement('canvas');
    this.canvas.id = this.options.id;
    this.canvas.width = this.map.getSize().width;
    this.canvas.height = this.map.getSize().height;
    this.ctx = this.canvas.getContext('2d');
    this.virtualCanvas = document.createElement('canvas');
    this.virtualCanvas.width = this.map.getSize().width;
    this.virtualCanvas.height = this.map.getSize().height;
    this.virtualCtx = this.virtualCanvas.getContext('2d');
    this.isInitialLoad = undefined;
  }
  
  setBoundLngLat() {
    let bounds, southwest, northeast;
    
    bounds = this.map.getBounds();
    northeast = bounds.getNorthEast();
    southwest = bounds.getSouthWest();
    this.boundLngLat = [northeast.lng, northeast.lat, southwest.lng, southwest.lat];
  }
  
  setMapCentre() {
    this.mapCentre = this.map.getCenter();
  }
  
}