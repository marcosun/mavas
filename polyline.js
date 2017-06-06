
/*
  *@param {String} polyline [polyline point lnglat]
  *@return {Object}
*/
function importPolyline(polyline) {
  this.polyline = {};
  this.polyline.original = polyline;
};

function draw() {
  let ia, ib, lena, lenb, eachLine, eachPoint, lngLat, cLngLat;
  
  //cache visible data
  this.setBoundLngLat();
  this.cacheVisiblePolyline();
  
  this.ctx.strokeStyle = '#FF0000';
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  
  ia = 0;
  lena = this.polyline.cache.length;
  while(ia < lena) {
    eachLine = this.polyline.cache[ia];
    this.ctx.beginPath();
    
    ib = 0;
    lenb = eachLine.length;
    while(ib < lenb) {
      eachPoint = eachLine[ib];
      lngLat = new AMap.LngLat(eachPoint[0], eachPoint[1]);
      cLngLat = this.map.lngLatToContainer(lngLat);
      this.ctx.lineTo(cLngLat.x, cLngLat.y);
      
      ib ++;
    };
    this.ctx.stroke();
    
    ia ++;
  };
};

/*
  *cache lines lie in map bounded area
  *create buffer area to draw more graphs beyong map bound
  *TODO: more acurate buffer area i.e. buffer for zoom level
*/
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