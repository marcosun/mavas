
/*
  *@param {String} polyline [polyline point lnglat]
  *@return {Object}
*/
function importPolyline(polyline) {
  this.polyline = polyline;
};

function draw() {
  this.ctx.strokeStyle = '#FF0000';
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  this.polyline.forEach((eachline) => {
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

export default {
  importPolyline,
  draw,
}