
/*
  *@param {String} polyline [polyline point lnglat]
  *@return {Object}
*/
function importPolyline(polyline) {
  this.polyline = {};
  this.polyline.original = polyline;
};

/*
  *this is where magic happens
*/
function draw() {
  let currentLine, currentPoint, lngLat, cLngLat;
  
  //cache visible data
  this.setBoundLngLat();
  this.setCentreLngLat();
  this.cacheVisiblePolyline();
  
  this.ctx.strokeStyle = '#FF0000';
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  
  let now = new Date();
  
  /*
    *draw lines with no delay
  */
  for(let ia = 0, lena = this.polyline.cache.length; ia < lena; ia++) {
    currentLine = this.polyline.cache[ia];
    this.ctx.beginPath();

    for(let ib = 0, lenb = currentLine.length; ib < lenb; ib++) {
      currentPoint = currentLine[ib];
      lngLat = new AMap.LngLat(currentPoint[0], currentPoint[1]);
      cLngLat = this.map.lngLatToContainer(lngLat);
      this.ctx.lineTo(cLngLat.x, cLngLat.y);
    };
    this.ctx.stroke();
  };
  
  /*
    *draw lines with time interval
  */
//  let i = 0, len = this.polyline.cache.length / 100;
//  
//  var interval = setInterval(() => {
//    for(let ia = i * 100, lena = (i + 1) * 100 > this.polyline.cache.length ? this.polyline.cache.length : (i + 1) * 100; ia < lena; ia++) {
//      currentLine = this.polyline.cache[ia];
//      this.ctx.beginPath();
//
//      for(let ib = 0, lenb = currentLine.length; ib < lenb; ib++) {
//        currentPoint = currentLine[ib];
//        lngLat = new AMap.LngLat(currentPoint[0], currentPoint[1]);
//        cLngLat = this.map.lngLatToContainer(lngLat);
//        this.ctx.lineTo(cLngLat.x, cLngLat.y);
//      };
//      this.ctx.stroke();
//    };
//    if (i + 1 > len) {
//      clearInterval(interval);
//    }
//    i ++;
//  });
  
  console.log(`canvas api uses ${new Date() - now}ms`);
};

/*
  *this is where performance enhancement comes in
  *look at my doc for explanation
*/
function cacheVisiblePolyline() {
  
  const cache = () => {
    if (previousPoint.isDrawn !== true) {
      resultLine.push(previousPoint.lngLat);
    }
    resultLine.push(currentPoint.lngLat);
    previousPoint = Object.assign({}, currentPoint, {isDrawn: true});
  };
  
  const dontCache = () => {
    if (previousPoint.isDrawn === true) {
      resultLine.push(currentPoint.lngLat);
    }
    if (resultLine.length !== 0) {
      this.polyline.cache.push(resultLine);
      resultLine = [];
    }
    previousPoint = Object.assign({}, currentPoint, {isDrawn: false});
  };
  
  
  let now = new Date();
  let currentLine, resultLine, currentPoint = {}, previousPoint = {}, positionDiff, r;
  
  this.polyline.cache = [];
  
  r = Math.sqrt((this.centreLngLat[0] - this.boundLngLat[0]) ^ 2 + (this.centreLngLat[1] - this.boundLngLat[1]) ^ 2);
  for(let ia = 0, lena = this.polyline.original.length; ia < lena; ia++) {
    currentLine = this.polyline.original[ia];
    resultLine = [];
    for(let ib = 1, lenb = currentLine.length; ib < lenb; ib++) {
      if (ib == 1) {
        previousPoint.lngLat = currentLine[ib - 1];
        previousPoint.position = lngLatToBlockPosition(previousPoint.lngLat, this.boundLngLat);
        
        if (previousPoint.position === 0) {
          resultLine.push(previousPoint.lngLat);
          previousPoint.isDrawn = true;
        }
      }
      
      currentPoint.lngLat = currentLine[ib];
      currentPoint.position = lngLatToBlockPosition(currentPoint.lngLat, this.boundLngLat);
      positionDiff = Math.abs(currentPoint.position - previousPoint.position);
      
      //rule 1
      if (currentPoint.position === 0) {
        cache();
        continue;
      }
      
      //rule 2
      if (positionDiff === 0) {
        dontCache();
        continue;
      };
      
      if (previousPoint.position % 2 !== 0) {
        switch(positionDiff) {
          //rule 3
          case 1:
          case 7:
            dontCache();
            continue;
            break;
          //rule 4
          case 4:
            cache();
            continue;
            break;
        };
      } else {
        switch(positionDiff) {
          //rule 5
          case 1:
          case 2:
          case 6:
          case 7:
            dontCache();
            continue;
            break;
        };
      }
      
      let A = previousPoint.lngLat[1] - currentPoint.lngLat[1];
      let B = currentPoint.lngLat[0] - previousPoint.lngLat[0];
      let C = previousPoint.lngLat[0] * currentPoint.lngLat[1] - currentPoint.lngLat[0] * previousPoint.lngLat[1];
      
      let d = Math.abs((A * this.centreLngLat[0] + B * this.centreLngLat[1] + C) / Math.sqrt(A ^ 2 + B ^ 2));
      
      //rule 6.1
      if (d > r) {
        dontCache();
        continue;
      } else {
        cache();
        continue;
      }
    };
    
    if (resultLine.length !== 0) {
      this.polyline.cache.push(resultLine);
      resultLine = [];
    }
    
  };
  console.log(`cache function uses ${new Date() - now}ms`);
  
  
  //virtual rendering algorithm
//  let now = new Date();
//  let boundLngBuffer,
//      boundLatBuffer,
//      expandedBoundLngLat;
//  
//  boundLngBuffer = this.boundLngLat[0] - this.boundLngLat[2];
//  boundLatBuffer = this.boundLngLat[1] - this.boundLngLat[3];
//  expandedBoundLngLat = [this.boundLngLat[2] - boundLngBuffer, this.boundLngLat[3] - boundLatBuffer, this.boundLngLat[0] + boundLngBuffer, this.boundLngLat[1] + boundLatBuffer];
//  
//  this.polyline.cache = [];
//  
//  this.polyline.original.forEach((eachline) => {
//    let result = [];
//    
//    eachline.forEach((point) => {
//      let lng = point[0],
//          lat = point[1];
//      if (lng >= expandedBoundLngLat[0] && lat >= expandedBoundLngLat[1] && lng <= expandedBoundLngLat[2] && lat <= expandedBoundLngLat[3] ) {
//        result.push(point);
//      }
//    });
//    
//    if (result.length !== 0) {
//      this.polyline.cache.push(result);
//    }
//  });
//  console.log(`cache function uses ${new Date() - now}ms`);
  //
};

function lngLatToBlockPosition(lngLat, boundLngLat) {
  let pointToNorthEast = [lngLat[0] - boundLngLat[0], lngLat[1] - boundLngLat[1]],
      pointToSouthWest = [lngLat[0] - boundLngLat[2], lngLat[1] - boundLngLat[3]];
  
  //[-, -][+, +]
  if (pointToNorthEast[0] < 0 && pointToNorthEast[1] < 0 && pointToSouthWest[0] > 0 && pointToSouthWest[1] > 0) {
    return 0;
  }
  
  //[-, +][+, +]
  if (pointToNorthEast[0] < 0 && pointToNorthEast[1] > 0 && pointToSouthWest[0] > 0 && pointToSouthWest[1] > 0) {
    return 1;
  }
  
  //[+, +][+, +]
  if (pointToNorthEast[0] > 0 && pointToNorthEast[1] > 0) {
    return 2;
  }
  
  //[+, -][+, +]
  if (pointToNorthEast[0] > 0 && pointToNorthEast[1] < 0 && pointToSouthWest[0] > 0 && pointToSouthWest[1] > 0) {
    return 3;
  }
  
  //[+, -][+, -]
  if (pointToNorthEast[0] > 0 && pointToNorthEast[1] < 0 && pointToSouthWest[0] > 0 && pointToSouthWest[1] < 0) {
    return 4;
  }
  
  //[-, -][+, -]
  if (pointToNorthEast[0] < 0 && pointToNorthEast[1] < 0 && pointToSouthWest[0] > 0 && pointToSouthWest[1] < 0) {
    return 5;
  }
  
  //[-, -][-, -]
  if (pointToSouthWest[0] < 0 && pointToSouthWest[1] < 0) {
    return 6;
  }
  
  //[-, -][-, +]
  if (pointToNorthEast[0] < 0 && pointToNorthEast[1] < 0 && pointToSouthWest[0] < 0 && pointToSouthWest[1] > 0) {
    return 7;
  }
  
  //[-, +][-, +]
  if (pointToNorthEast[0] < 0 && pointToNorthEast[1] > 0 && pointToSouthWest[0] < 0 && pointToSouthWest[1] > 0) {
    return 8;
  }
};

export default {
  importPolyline,
  draw,
  cacheVisiblePolyline,
}