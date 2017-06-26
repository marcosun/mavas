import Util from '../util';
import markerImg from '../image/marker_default.png';

//load marker icon
let icon = document.createElement('img');
icon.src = markerImg;

/*
  *@param {location, icon} data [location = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; icon is array of canvases for marker icons]
  //TODO: only supports 1 line
*/
function importData(data) {
  this.marker = {};
  this.marker.original = [];
  
  let isDefaultIcon = data.icon.length === 0,
      location,
      flagDesc,
      markerCanvas,
      markerCtx,
      textPixcel = {
        x: null,
        y: null,
      };
  
  for(let i = 0, len = data.location.length; i < len; i ++) {
    location = data.location[i];
    
    if (isDefaultIcon) {
      //default icon: blue balloon with black auto increment number
      markerCanvas = document.createElement('canvas');
      markerCanvas.width = icon.width;
      markerCanvas.height = icon.height;
      markerCtx = markerCanvas.getContext('2d');
      
      markerCtx.drawImage(icon, 0, 0);
      
      //flag now default to AI ids starting from 0
      flagDesc = i.toString();
      
      //position text on the centre of the icon
      switch(flagDesc.length) {
        case 1:
          textPixcel.x = icon.width / 2 - 3;
          textPixcel.y = icon.height / 2 - 2;
          break;
        case 2:
          textPixcel.x = icon.width / 2 - 6;
          textPixcel.y = icon.height / 2 - 2;
          break;
        default:
          textPixcel.x = icon.width / 2 - 9;
          textPixcel.y = icon.height / 2 - 2;
      };
      markerCtx.fillText(flagDesc, textPixcel.x, textPixcel.y);
    } else {
      //use canvas without any configuration
      markerCanvas = data.icon[i];
    }
    
    this.marker.original.push({
      location: location,
      icon: markerCanvas,
      lngLat: new AMap.LngLat(location[0], location[1]),
    });
  }
};

/*
  *this is where magic happens
*/
function draw() {
  let currentPoint, cLngLat;
  
  //virtual canvas buffer
  const drawBubbles = () => {
    let now = new Date();
    let icon;
    
    this.virtualCtx.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
    
    for(let i = 0, len = this.marker.cache.length; i < len; i ++) {
      currentPoint = this.marker.cache[i];
      icon = currentPoint.icon;
      
      cLngLat = this.map.lngLatToContainer(currentPoint.lngLat);
      
      this.virtualCtx.drawImage(icon, cLngLat.x - icon.width / 2, cLngLat.y - icon.height);
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
    
    console.log(`canvas api uses ${new Date() - now}ms`);
  }
  
  const drawBubblesOnDrag = () => {
    let now = new Date();
    let icon,
        parentNode = document.getElementById(this.option.id).parentNode;
    
    this.virtualCtx.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
    
    for(let i = 0, len = this.marker.cache.length; i < len; i ++) {
      currentPoint = this.marker.cache[i];
      icon = currentPoint.icon;
      
      //if marker point is not in the canvas visible area, do not draw
      cLngLat = this.map.lngLatToContainer(currentPoint.lngLat);

      this.virtualCtx.drawImage(icon, cLngLat.x - icon.width / 2, cLngLat.y - icon.height);
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
    
    Util.offsetCanvasPositionOnDrag(parentNode);
    
    console.log(`canvas api uses ${new Date() - now}ms`);
  };
  
  //setting indicator: isInitialLoad
  Util.setIsInitialLoadIndicator.call(this);
  
  if (this.option.realtime === true) {
    if (this.isInitialLoad === true) {
      
      //this is the best fit from many tests
      this.timerThreshold = 100;
      
      /*
        *draw canvas immediately on page show for the first time
      */
      //cache visible data
      this.setBoundLngLat();
      this.cacheVisibleMarker();

      drawBubbles();
      
      //hook dragging event to redraw canvas
      this.map.on('dragging', (e) => {
        if (new Date() - this.lastTimer < this.timerThreshold) {
          clearTimeout(this.timerId);
        }
        
        this.timerId = setTimeout(() => {
          //cache visible data
          this.setBoundLngLat();
          this.cacheVisibleMarker();

          drawBubblesOnDrag();
        }, this.timerThreshold);
        
        this.lastTimer = new Date();
      });
      
      //hook zoom event to redraw canvas
      this.map.on('zoomend', (e) => {
        //cache visible data
        this.setBoundLngLat();
        this.cacheVisibleMarker();

        drawBubblesOnDrag();
        
        this.lastTimer = new Date();
      });
      
    } else {
      //once zoomend or dragend, reset canvas position to offset margin styles
      Util.resetCanvasPositionAfterDrag(document.getElementById(this.option.id).parentNode);
      this.lastTimer = new Date();
    }
  } else {
    //cache visible data
    this.setBoundLngLat();
    this.cacheVisibleMarker();

    drawBubbles();
  }
};

//simpleAlgorithm
function cacheVisibleMarker() {
  let now = new Date();
  this.marker.cache = [];

  for(let i = 0, len = this.marker.original.length; i < len; i ++) {
    let marker = this.marker.original[i],
        lng = marker.location[0],
        lat = marker.location[1];

    if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {
      this.marker.cache.push(Object.assign({}, marker));
    } else {
//      this.marker.cache.push({flagDesc: marker.flagDesc, flagDescLen: marker.flagDescLen,});
    }
  }
  console.log(`cache function uses ${new Date() - now}ms`);
};

export default {
  importData,
  draw,
  cacheVisibleMarker,
}