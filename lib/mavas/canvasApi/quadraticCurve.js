import Util from '../util';

/*
  *@param {String} data [curve point lnglat]
*/
function importData(data) {
  //modify structure and save to original
  const save = (data) => {
    let currentLine, currentPoint, newCurrentLine;
    
    for(let ia = 0, lena = data.location.length; ia < lena; ia++) {
      currentLine = data.location[ia];
      newCurrentLine = [];

      for(let ib = 0, lenb = currentLine.length; ib < lenb; ib++) {
        currentPoint = currentLine[ib];

        newCurrentLine.push({
          location: currentPoint,
          lnglat: new AMap.LngLat(currentPoint[0], currentPoint[1]),
        });
      };

      this.curve.original.push(newCurrentLine);
    };
  };
  
  this.curve = {};
  this.curve.original = [];
  
  save(data);
};

/*
  *this is where magic happens
  *@param {Boolean} isForceRedraw [optional: true: force redraw, default to false;]
*/
function draw(isForceRedraw) {
  
  const drawManyCurves = () => {
    let currentLine, currentPoint, previousPoint, currentPixel, previousPixel, centre, distanceOfPoints, distanceToControlPoint, k, b, A, B, C, controlPointX, controlPointY, controlPoint;
    
    this.virtualCtx.strokeStyle = this.options.color;
    this.virtualCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for(let ia = 0, lena = this.curve.cache.length; ia < lena; ia++) {
      currentLine = this.curve.cache[ia];
      this.virtualCtx.beginPath();

      for(let ib = 1, lenb = currentLine.length; ib < lenb; ib++) {
        previousPoint = currentLine[ib - 1];
        currentPoint = currentLine[ib];
        previousPixel = this.map.lngLatToContainer(previousPoint.lnglat);
        currentPixel = this.map.lngLatToContainer(currentPoint.lnglat);
        
        centre = {
          x: (previousPixel.x + currentPixel.x) / 2,
          y: (previousPixel.y + currentPixel.y) / 2,
        };
        
        distanceOfPoints = Math.sqrt(Math.pow(previousPixel.x - currentPixel.x, 2) + Math.pow(previousPixel.y - currentPixel.y, 2));
        distanceToControlPoint = distanceOfPoints / 4;
        k = - (previousPixel.x - currentPixel.x) / (previousPixel.y - currentPixel.y);
        b = centre.y - k * centre.x;
        
        A = 1 + Math.pow(k, 2);
        B = 2 * (k * b - centre.x - k * centre.y);
        C = Math.pow(centre.x, 2) + Math.pow(centre.y, 2) + Math.pow(b, 2) - 2 * b * centre.y - Math.pow(distanceToControlPoint, 2);
        
        controlPointX = (-B + Math.sqrt(Math.pow(B, 2) - 4 * A * C)) / (2 * A);
        controlPointY = k * controlPointX + b;
        controlPoint = {
          x: controlPointX,
          y: controlPointY,
        };
        
        this.virtualCtx.moveTo(previousPixel.x, previousPixel.y);
        this.virtualCtx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPixel.x, currentPixel.y);
      };
      this.virtualCtx.stroke();
    };
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
  };
  
  /*
    *draw lines with no delay
  */
  const drawWithNoDelay = () => {
    let now = new Date();
    
    drawManyCurves();
    
    console.log(`canvas api uses ${new Date() - now}ms`);
  };
  
  /*
    *draw lines with delay
    @param {{interval: Number, size: Number}} delay [compulsory]
  */
  const drawWithDelay = () => {
    let currentLine, currentPoint, previousPoint, currentPixel, previousPixel, centre, distanceOfPoints, distanceToControlPoint, k, b, A, B, C, controlPointX, controlPointY, controlPoint;
    
    const draw = (i) => {
      for(let ia = i * delaySize, lena = (i + 1) * delaySize > this.curve.cache.length ? this.curve.cache.length : (i + 1) * delaySize; ia < lena; ia++) {
        currentLine = this.curve.cache[ia];
        this.virtualCtx.beginPath();

        for(let ib = 1, lenb = currentLine.length; ib < lenb; ib++) {
          previousPoint = currentLine[ib - 1];
          currentPoint = currentLine[ib];
          previousPixel = this.map.lngLatToContainer(previousPoint.lnglat);
          currentPixel = this.map.lngLatToContainer(currentPoint.lnglat);
          
          centre = {
            x: (previousPixel.x + currentPixel.x) / 2,
            y: (previousPixel.y + currentPixel.y) / 2,
          };

          distanceOfPoints = Math.sqrt(Math.pow(previousPixel.x - currentPixel.x, 2) + Math.pow(previousPixel.y - currentPixel.y, 2));
          distanceToControlPoint = distanceOfPoints / 4;
          k = - (previousPixel.x - currentPixel.x) / (previousPixel.y - currentPixel.y);
          b = centre.y - k * centre.x;

          A = 1 + Math.pow(k, 2);
          B = 2 * (k * b - centre.x - k * centre.y);
          C = Math.pow(centre.x, 2) + Math.pow(centre.y, 2) + Math.pow(b, 2) - 2 * b * centre.y - Math.pow(distanceToControlPoint, 2);

          controlPointX = (-B + Math.sqrt(Math.pow(B, 2) - 4 * A * C)) / (2 * A);
          controlPointY = k * controlPointX + b;
          controlPoint = {
            x: controlPointX,
            y: controlPointY,
          };

          this.virtualCtx.moveTo(previousPixel.x, previousPixel.y);
          this.virtualCtx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPixel.x, currentPixel.y);
        };
        this.virtualCtx.stroke();
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.virtualCanvas, 0, 0);
      };
    };
    
    let now = new Date();
    let delayInterval = this.options.delay.interval, delaySize = this.options.delay.size, i = 0, len = this.curve.cache.length / delaySize;

    this.virtualCtx.strokeStyle = this.options.color;
    this.virtualCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    //immediately call draw at least once
    draw(i);
    i++;
    
    var interval = setInterval(() => {
      draw(i);
      if (i + 1 > len) {
        clearInterval(interval);
      }
      i ++;
    }, delayInterval);
    console.log(`canvas api uses ${new Date() - now}ms`);
  };
  
  const drawWithNoDelayOnDrag = () => {
    let now = new Date();
    let parentNode = document.getElementById(this.options.id).parentNode;
    
    drawManyCurves();
    
    Util.offsetCanvasPositionOnDrag(parentNode);
    
    console.log(`canvas api uses ${new Date() - now}ms`);
  };
  
  //setting indicator: isInitialLoad
  Util.setIsInitialLoadIndicator.call(this);
  
  if (isForceRedraw === true) {
    //cache visible data
    this.setBoundLngLat();
    this.setMapCentre();
    this.cacheVisiblePolyline();

    if (this.options.delay === undefined) {
      drawWithNoDelay();
    } else {
      drawWithDelay(this.options.delay);
    }
    
    return;
  }
  
  if (this.options.realtime === true) {
    if (this.isInitialLoad === true) {
      
      //this is the best fit from many tests
      this.timerThreshold = 100;
      
      /*
        *draw canvas immediately on page show for the first time
      */
      //cache visible data
      this.setBoundLngLat();
      this.setMapCentre();
      this.cacheVisiblePolyline();
      
      drawWithNoDelay();
      
      //hook dragging event to redraw canvas
      this.map.on('dragging', (e) => {
        if (new Date() - this.lastTimer < this.timerThreshold) {
          clearTimeout(this.timerId);
        }
        
        this.timerId = setTimeout(() => {
          this.setBoundLngLat();
          this.setMapCentre();
          this.cacheVisiblePolyline();

          drawWithNoDelayOnDrag();
        }, this.timerThreshold);
        
        this.lastTimer = new Date();
      });
      
      //hook zoom event to redraw canvas
      this.map.on('zoomend', (e) => {
        //cache visible data
        this.setBoundLngLat();
        this.setMapCentre();
        this.cacheVisiblePolyline();

        drawWithNoDelay();
        
        this.lastTimer = new Date();
      });
      
    } else {
      //once zoomend or dragend, reset canvas position to offset margin styles
      Util.resetCanvasPositionAfterDrag(document.getElementById(this.options.id).parentNode);
      this.lastTimer = new Date();
    }
  } else {
    //cache visible data
    this.setBoundLngLat();
    this.setMapCentre();
    this.cacheVisiblePolyline();

    if (this.options.delay === undefined) {
      drawWithNoDelay();
    } else {
      drawWithDelay(this.options.delay);
    }
  }
};

/*
  *this is where performance enhancement comes in
  *look at my doc for explanation
*/
function cacheVisiblePolyline() {
  
  function lngLatToBlockPosition(lnglat, boundLngLat) {
    let pointToNorthEast = [lnglat.lng - boundLngLat[0], lnglat.lat - boundLngLat[1]],
        pointToSouthWest = [lnglat.lng - boundLngLat[2], lnglat.lat - boundLngLat[3]];

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
  
  //9 blocks algorithm
  const nineBlocksAlgorithm = () => {
    let now = new Date();
    let currentLine, resultLine, currentPoint, previousPoint, positionDiff, r;
    this.curve.cache = [];
    
    const cache = () => {
      if (previousPoint.isDrawn !== true) {
        resultLine.push(previousPoint);
      }
      resultLine.push(currentPoint);
      previousPoint = Object.assign({}, currentPoint, {isDrawn: true});
    };

    const dontCache = () => {
      if (previousPoint.isDrawn === true) {
        resultLine.push(currentPoint);
      }
      if (resultLine.length !== 0) {
        this.curve.cache.push(resultLine);
        resultLine = [];
      }
      previousPoint = Object.assign({}, currentPoint, {isDrawn: false});
    };

    r = Math.sqrt(Math.pow(this.mapCentre.lng - this.boundLngLat[0], 2) + Math.pow(this.mapCentre.lat - this.boundLngLat[1], 2));
    for(let ia = 0, lena = this.curve.original.length; ia < lena; ia++) {
      currentLine = this.curve.original[ia];
      resultLine = [];
      for(let ib = 1, lenb = currentLine.length; ib < lenb; ib++) {
        if (ib == 1) {
          previousPoint = Object.assign({}, currentLine[ib - 1]);
          previousPoint.position = lngLatToBlockPosition(previousPoint.lnglat, this.boundLngLat);

          if (previousPoint.position === 0) {
            resultLine.push(previousPoint);
            previousPoint.isDrawn = true;
          }
        }
        
        currentPoint = Object.assign({}, currentLine[ib]);
        currentPoint.position = lngLatToBlockPosition(currentPoint.lnglat, this.boundLngLat);
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

        let A = previousPoint.lnglat.lat - currentPoint.lnglat.lat;
        let B = currentPoint.lnglat.lng - previousPoint.lnglat.lng;
        let C = previousPoint.lnglat.lng * currentPoint.lnglat.lat - currentPoint.lnglat.lng * previousPoint.lnglat.lat;

        let d = Math.abs((A * this.mapCentre.lng + B * this.mapCentre.lat + C) / Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2)));

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
        this.curve.cache.push(resultLine);
        resultLine = [];
      }

    };
    console.log(`cache function uses ${new Date() - now}ms`);
  };
  
  //simple algorithm
  const simpleAlgorithm = () => {
    let now = new Date();
    let boundLngBuffer,
        boundLatBuffer,
        expandedBoundLngLat;

    boundLngBuffer = this.boundLngLat[0] - this.boundLngLat[2];
    boundLatBuffer = this.boundLngLat[1] - this.boundLngLat[3];
    expandedBoundLngLat = [this.boundLngLat[2] - boundLngBuffer, this.boundLngLat[3] - boundLatBuffer, this.boundLngLat[0] + boundLngBuffer, this.boundLngLat[1] + boundLatBuffer];

    this.curve.cache = [];

    this.curve.original.forEach((eachline) => {
      let result = [];

      eachline.forEach((point) => {
        let lng = point.lnglat.lng,
            lat = point.lnglat.lat;
        if (lng >= expandedBoundLngLat[0] && lat >= expandedBoundLngLat[1] && lng <= expandedBoundLngLat[2] && lat <= expandedBoundLngLat[3] ) {
          result.push(point);
        }
      });

      if (result.length !== 0) {
        this.curve.cache.push(result);
      }
    });
    console.log(`cache function uses ${new Date() - now}ms`);
  };
  
  switch(this.options.cacheAlgo) {
    case '9 blocks':
      nineBlocksAlgorithm();
      break;
    case 'simple':
      simpleAlgorithm();
      break;
  };
};

export default {
  importData,
  draw,
  cacheVisiblePolyline,
}