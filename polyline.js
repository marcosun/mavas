
/*
  *@param {String} polyline [polyline point lnglat]
  *@return {Object}
*/
function importPolyline(polyline) {
  this.polyline = {};
  this.polyline.original = polyline;
};

function draw() {
  //cache visible data
  this.setBoundLngLat();
  this.cacheVisiblePolyline();
  
  this.ctx.strokeStyle = '#FF0000';
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  this.polyline.cache.forEach((eachline) => {
    this.ctx.beginPath();
    eachline.forEach((point) => {
      let lnglat, clnglat;
      lnglat = new AMap.LngLat(point[0], point[1]);
      clnglat = this.map.lngLatToContainer(lnglat);
      this.ctx.lineTo(clnglat.x, clnglat.y);
    });
    this.ctx.stroke();
  });
};

function cacheVisiblePolyline() {
  let boundLngBuffer,
      boundLatBuffer,
      expandedBoundLngLat;
  
  boundLngBuffer = this.boundLngLat[2] - this.boundLngLat[0];
  boundLatBuffer = this.boundLngLat[3] - this.boundLngLat[1];
  expandedBoundLngLat = [this.boundLngLat[0] - boundLngBuffer, this.boundLngLat[1] - boundLatBuffer, this.boundLngLat[2] + boundLngBuffer, this.boundLngLat[3] + boundLatBuffer];
  
  this.polyline.cache = [];
  
  this.polyline.original.forEach((eachline) => {
    let result = [];
    
    eachline.forEach((point) => {
      let lng = point[0],
          lat = point[1];
      if (lng >= expandedBoundLngLat[0] && lat >= expandedBoundLngLat[1] && lng <= expandedBoundLngLat[2] && lat <= expandedBoundLngLat[3] ) {
        result.push(point);
      }
    });
    
    if (result.length !== 0) {
      this.polyline.cache.push(result);
    }
  });
};

export default {
  importPolyline,
  draw,
  cacheVisiblePolyline,
}