import Util from './util';

let iconWidth = 19,
    iconHeight = 31,
    isMapMoving = false;

/*
  *@param {Object} data [optional, data: {marker, tooltip}, marker: [[lng, lat], [lng, lat]], lng: Number, lat: Number, tooltip: [tooltipStr, tooltipStr], tooltipStr: String]
*/
function importData(data) {
  this.tooltip = {};
  this.tooltip.original = {};
  this.tooltip.original.marker = [];
  this.tooltip.original.tooltip = [];
  
  for(let i = 0, len = data.marker.length; i < len; i ++) {
    let marker = data.marker[i];
    
    this.tooltip.original.marker.push({
      data: marker,
      lngLat: new AMap.LngLat(marker[0], marker[1]),
      //id now default to AI ids starting from 0
      id: i,
    });
    
    this.tooltip.original.tooltip.push(data.tooltip[i]);
  }
};

/*
  *this is where magic happens
*/
function draw() {
  let currentBoundPixcel, result;
  
  Util.setIsInitialLoadIndicator.call(this);
  
  //cache visible data
  this.setBoundLngLat();
  this.cacheVisibleTooltip();
  
  //bind event only once!
  if (this.isInitialLoad === true) {
    this.map.on('movestart', (e) => {
      isMapMoving = true;
    });
    
    this.map.on('moveend', (e) => {
      isMapMoving = false;
    });
    
    this.map.on('mousemove', (e) => {
      if (isMapMoving === false) {
        result = Util.findLast(this.tooltip.cache, (currentPoint, i, array) => {
          currentBoundPixcel = currentPoint.boundPixcel;

          return e.pixel.x <= currentBoundPixcel[0] && e.pixel.y >= currentBoundPixcel[1] && e.pixel.x >= currentBoundPixcel[2] && e.pixel.y <= currentBoundPixcel[3];
        });

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (result) {
          this.ctx.font = '20px Georgia';
          this.ctx.fillText(result.tooltip, result.boundPixcel[0], result.boundPixcel[3]);
        }
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
  
  console.log(`cache function uses ${new Date() - now}ms`);
};

export default {
  importData,
  draw,
  cacheVisibleTooltip,
}