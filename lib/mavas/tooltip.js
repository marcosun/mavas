let iconWidth = 19,
    iconHeight = 31,
    mousemoveBinded = false;

/*
  *@param {String} data [marker point lnglat]
  *@return {Object}
*/
function importData(data) {
  this.tooltip = {};
  this.tooltip.original = {};
  this.tooltip.original.marker = [];
  this.tooltip.original.tooltip = data.tooltip;
  
  for(let i = 0, len = data.marker.length; i < len; i ++) {
    let marker = data.marker[i];
    
    this.tooltip.original.marker.push({
      data: marker,
      lngLat: new AMap.LngLat(marker[0], marker[1]),
      //id now default to AI ids starting from 0
      id: i,
    });
  }
};

/*
  *this is where magic happens
*/
function draw() {
  let currentPoint, cLngLat, currentBoundPixcel, result;
  
//  const paint = () => {
//    let now = new Date();
//    let textLng, textLat;
//    
//    for(let i = 0, len = this.marker.cache.length; i < len; i ++) {
//      currentPoint = this.marker.cache[i];
//      
//      //if marker point is not in the canvas visible area, do not draw
//      if (currentPoint.data) {
//        cLngLat = this.map.lngLatToContainer(currentPoint.lngLat);
//        
//        this.ctx.drawImage(icon, cLngLat.x - iconWidth / 2, cLngLat.y - iconHeight);
//        //position text on the centre of the icon
//        switch(currentPoint.flagDescLen) {
//          case 1:
//            textLng = cLngLat.x - 3;
//            textLat = cLngLat.y - 15;
//            break;
//          case 2:
//            textLng = cLngLat.x - 6;
//            textLat = cLngLat.y - 15;
//            break;
//          default:
//            textLng = cLngLat.x - 9;
//            textLat = cLngLat.y - 15;
//        };
//        this.ctx.fillText(currentPoint.flagDesc, textLng, textLat);
//      }
//    }
//    console.log(`canvas api uses ${new Date() - now}ms`);
//  }
  
  //cache visible data
  this.setBoundLngLat();
  this.cacheVisibleTooltip();
  
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
  if (!mousemoveBinded) {
    this.map.on('mousemove', (e) => {
      result = [];
      
      for (let i = 0, len = this.tooltip.cache.length; i < len; i ++) {
        //debugger;
        currentPoint = this.tooltip.cache[i]
        currentBoundPixcel = currentPoint.boundPixcel;
        
        if (e.pixel.x <= currentBoundPixcel[0] && e.pixel.y >= currentBoundPixcel[1] && e.pixel.x >= currentBoundPixcel[2] && e.pixel.y <= currentBoundPixcel[3]) {
          result.push(currentPoint);
        }
      }
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (result.length !== 0) {
        currentPoint = result.pop();
        //debugger;
        this.ctx.fillText(currentPoint.tooltip, currentPoint.boundPixcel[0], currentPoint.boundPixcel[3]);
      }
    });
  }
};

//simpleAlgorithm
function cacheVisibleTooltip() {
  let now = new Date();
  let markerPixcel;
  this.tooltip.cache = [];

  for(let i = 0, len = this.tooltip.original.marker.length; i < len; i ++) {
    let marker = this.tooltip.original.marker[i],
        tooltip = this.tooltip.original.tooltip[i],
        lng = marker.data[0],
        lat = marker.data[1];
    
    if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {
      markerPixcel = this.map.lngLatToContainer(marker.lngLat);
      
      this.tooltip.cache.push(
        Object.assign(
          {},
          marker,
          {
            boundPixcel: [markerPixcel.x + iconWidth / 2, markerPixcel.y - iconHeight, markerPixcel.x - iconWidth / 2, markerPixcel.y],
            tooltip,
          },
        )
      );
    }
  }
  console.log(this.tooltip.cache);
  console.log(`cache function uses ${new Date() - now}ms`);
};

export default {
  importData,
  draw,
  cacheVisibleTooltip,
}