import markerImg from './image/marker_default.png';


//load marker icon
let icon = document.createElement('img'),
    iconWidth = 19,
    iconHeight = 31,
    marker,
    iconLoaded = false;

/*
  *@param {String} data [marker point lnglat]
  *@return {Object}
  //TODO: only supports 1 line
*/
function importData(data) {
  this.marker = {};
  this.marker.original = [];
  
  for(let i = 0, len = data[0].length; i < len; i ++) {
    let marker = data[0][i],
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
  
  const paint = () => {
    let now = new Date();
    let textLng, textLat;
    
    for(let i = 0, len = this.marker.cache.length; i < len; i ++) {
      currentPoint = this.marker.cache[i];
      
      //if marker point is not in the canvas visible area, do not draw
      if (currentPoint.data) {
        cLngLat = this.map.lngLatToContainer(currentPoint.lngLat);
        
        this.ctx.drawImage(icon, cLngLat.x - iconWidth / 2, cLngLat.y - iconHeight);
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
        this.ctx.fillText(currentPoint.flagDesc, textLng, textLat);
      }
    }
    console.log(`canvas api uses ${new Date() - now}ms`);
  }
  
  //cache visible data
  this.setBoundLngLat();
  this.cacheVisibleMarker();
  
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
  //calling canvas apis wait until marker icon is loaded
  if (iconLoaded) {
    paint();
  } else {
    icon.src = markerImg;
    icon.onload = () => {
      paint();
    };
  }
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