import Util from '../util';

let isMapMoving = false;

/*
  *@param {Object} data [optional, data: {marker, tooltip}, marker: [[lng, lat], [lng, lat]], lng: Number, lat: Number, tooltip: [tooltipStr, tooltipStr], tooltipStr: String]
*/
function importData(data) {
  
  const save = (data) => {
    for(let i = 0, len = data.location.length; i < len; i ++) {
      let location = data.location[i];

      this.tooltip.original.push({
        location: location,
        lnglat: new AMap.LngLat(location[0], location[1]),
        markerSize: data.markerSize[i],
        desc: data.desc[i],
      });
    };
  };
  
  this.tooltip = {};
  this.tooltip.original = [];
  
  save(data);
};

/*
  *this is where magic happens
*/
function draw() {
  let currentBoundPixel, result;
  
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
          currentBoundPixel = currentPoint.boundPixel;

          return e.pixel.x <= currentBoundPixel[0] && e.pixel.y >= currentBoundPixel[1] && e.pixel.x >= currentBoundPixel[2] && e.pixel.y <= currentBoundPixel[3];
        });

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (result) {
          this.ctx.font = '20px Georgia';
          this.ctx.fillText(result.desc, result.boundPixel[0], result.boundPixel[3]);
        }
      }
    });
  }
};

//simpleAlgorithm
function cacheVisibleTooltip() {
  let now = new Date();
  let tooltip, pixel, lng, lat;
  this.tooltip.cache = [];

  for(let i = 0, len = this.tooltip.original.length; i < len; i ++) {
    tooltip = this.tooltip.original[i];
    lng = tooltip.lnglat.lng;
    lat = tooltip.lnglat.lat;
    
    if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {
      pixel = this.map.lngLatToContainer(tooltip.lnglat);
      
      this.tooltip.cache.push(
        Object.assign(
          {},
          tooltip,
          {
            boundPixel: [pixel.x + tooltip.markerSize.width / 2, pixel.y - tooltip.markerSize.height, pixel.x - tooltip.markerSize.width / 2, pixel.y]
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