import Util from './util';
import markerImg from './image/marker_default.png';

//load marker icon
let icon = document.createElement('img'),
    iconWidth = 19,
    iconHeight = 31,
    marker,
    isIconLoaded = false;

/*
  *@param {String} data [marker point lnglat]
  //TODO: only supports 1 line
*/
function importData(data) {
  this.marker = {};
  this.marker.original = [];
  
  for(let i = 0, len = data.length; i < len; i ++) {
    let marker = data[i],
        //flag now default to AI ids starting from 0
        flagDesc = i.toString();

    this.marker.original.push({
      data: marker,
      lngLat: new AMap.LngLat(marker[0], marker[1]),
      flagDesc,
      flagDescLen: flagDesc.length,
    });
  }
};

/*
  *this is where magic happens
*/
function draw() {
  let currentPoint, cLngLat;
  
  //calling canvas apis wait until marker icon is loaded
  const drawBubbles = () => {
    if (isIconLoaded) {
      draw();
    } else {
      icon.src = markerImg;
      icon.onload = () => {
        draw();
        isIconLoaded = true;
      };
    }
  };
  
  //virtual canvas buffer
  const draw = () => {
    let now = new Date();
    let textLng, textLat;
    
    this.virtualCtx.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
    
    for(let i = 0, len = this.marker.cache.length; i < len; i ++) {
      currentPoint = this.marker.cache[i];
      
      //if marker point is not in the canvas visible area, do not draw
      if (currentPoint.data) {
        cLngLat = this.map.lngLatToContainer(currentPoint.lngLat);
        
        this.virtualCtx.drawImage(icon, cLngLat.x - iconWidth / 2, cLngLat.y - iconHeight);
        //position text on the centre of the icon
        switch(currentPoint.flagDescLen) {
          case 1:
            textLng = cLngLat.x - 3;
            textLat = cLngLat.y - 15;
            break;
          case 2:
            textLng = cLngLat.x - 6;
            textLat = cLngLat.y - 15;
            break;
          default:
            textLng = cLngLat.x - 9;
            textLat = cLngLat.y - 15;
        };
        this.virtualCtx.fillText(currentPoint.flagDesc, textLng, textLat);
      }
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
    
    if (this.option.fit === true && this.isInitialLoad === true) {
      setFit();
    };
    
    console.log(`canvas api uses ${new Date() - now}ms`);
  }
  
  const setFit = () => {
    let data = Util.pluck(this.marker.original, 'data'),
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
  
  //setting indicator: isInitialLoad
  const setIsInitialLoad = () => {
    if (this.isInitialLoad === true) {
      this.isInitialLoad = false;
    }

    if (this.isInitialLoad === undefined) {
      this.isInitialLoad = true;
    }
  };
  
  setIsInitialLoad();
  
  //cache visible data
  this.setBoundLngLat();
  this.cacheVisibleMarker();
  
  drawBubbles();
};

//simpleAlgorithm
function cacheVisibleMarker() {
  let now = new Date();
  this.marker.cache = [];

  for(let i = 0, len = this.marker.original.length; i < len; i ++) {
    let marker = this.marker.original[i],
        lng = marker.data[0],
        lat = marker.data[1];

    if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {
      this.marker.cache.push(Object.assign({}, marker));
    } else {
      this.marker.cache.push({flagDesc: marker.flagDesc, flagDescLen: marker.flagDescLen,});
    }
  }
  console.log(`cache function uses ${new Date() - now}ms`);
};

export default {
  importData,
  draw,
  cacheVisibleMarker,
}