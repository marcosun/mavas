import Util from '../util';
import importData from './common/importData';
import {default as cacheVisiblePolyline} from './common/cacheAlgo';
import setStyleAndStroke from './common/setStyleAndStroke';
import drawWithSymbol from './common/drawWithSymbol';

/*
  *this is where magic happens
  *@param {Boolean} isForceRedraw [optional: true: force redraw, default to false;]
*/
function draw(isForceRedraw) {
  
  const drawManyPolylines = () => {
    let currentLine, pixel;
    
    this.virtualCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for(let ia = 0, lena = this.polyline.cache.length; ia < lena; ia++) {
      currentLine = this.polyline.cache[ia];
      this.virtualCtx.beginPath();

      for(let ib = 0, lenb = currentLine.coords.length; ib < lenb; ib++) {
        pixel = currentLine.pixel[ib];
        this.virtualCtx.lineTo(pixel.x, pixel.y);
      }
      setStyleAndStroke(this.virtualCtx, currentLine.lineStyle);
      drawWithSymbol(this.virtualCtx, currentLine.symbol, this.map.lngLatToContainer(currentLine.lnglat[0]), this.map.lngLatToContainer(currentLine.lnglat[currentLine.lnglat.length - 1]));
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
  };
  
  /*
    *draw lines with no delay
  */
  const drawWithNoDelay = () => {
    drawManyPolylines();
  };
  
  /*
    *draw lines with delay
    @param {{interval: Number, size: Number}} delay [compulsory]
  */
  const drawWithDelay = () => {
    let currentLine, pixel;
    
    const draw = (i) => {
      for(let ia = i * delaySize, lena = (i + 1) * delaySize > this.polyline.cache.length ? this.polyline.cache.length : (i + 1) * delaySize; ia < lena; ia++) {
        currentLine = this.polyline.cache[ia];
        this.virtualCtx.beginPath();

        for(let ib = 0, lenb = currentLine.coords.length; ib < lenb; ib++) {
          pixel = currentLine.pixel[ib];
          this.virtualCtx.lineTo(pixel.x, pixel.y);
        }
        setStyleAndStroke(this.virtualCtx, currentLine.lineStyle);
        drawWithSymbol(this.virtualCtx, currentLine.symbol, this.map.lngLatToContainer(currentLine.lnglat[0]), this.map.lngLatToContainer(currentLine.lnglat[currentLine.lnglat.length - 1]));
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.virtualCanvas, 0, 0);
      }
    };
    
    let delayInterval = this.options.algo.delay.interval, delaySize = this.options.algo.delay.size, i = 0, len = this.polyline.cache.length / delaySize;

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
  };
  
  const drawWithNoDelayOnDrag = () => {
    let parentNode = document.getElementById(this.options.id).parentNode;
    
    drawManyPolylines();
    
    Util.offsetCanvasPositionOnDrag(parentNode);
  };
  
  const shouldDrawWithDelay = () => {
    return this.options.algo.delay.size !== undefined;
  };
  
  const shouldDrawWithRealtime = () => {
    return this.options.algo.isRealtime === true;
  };

  const shouldHookOnclick = () => {
    return this.options.onClick instanceof Function;
  };

  const mapSegmentToOriginalPolyline = (segmentPolyline) => {
    const originalId = segmentPolyline.originalId;

    return this.polyline.original[originalId];
  };

  /**
   * Test if a point is on polyline
   * @param  {Object} pointPosition Point position i.e. {x: number, y: number}
   * @param  {[Object]} polyline   Representing polyline i.e. [{x: number, y: number}, {x: number, y: number}]
   * @param  {number || 5} buffer     Deviation from polyline would be considered as on the line
   * @return {boolean}
   */
  // const isPointOnPolyline = (pointPosition, polyline, buffer = 5) => {
  //   let minDistance = getMinDistanceToSegmentPolyline(pointPosition, polyline);

  //   return minDistance <= buffer;
  // };
  
  const isDistanceUnderBuffer = (distance, buffer = 5) => {
    return distance <= buffer;
  };

  /**
   * Get minimum distance from a point to a segment polyline
   * @param  {Object} mousePosition Point position i.e. {x: number, y: number}
   * @param  {[Object]} polyline      Representing polyline i.e. [{x: number, y: number}, {x: number, y: number}]
   * @return {number}               Minimum distance in number, if polyline is provided, return Infinity
   */
  const getMinDistanceToSegmentPolyline = (pointPosition, polyline) => {
    let minDistance = Infinity;

    for (let i = 1, len = polyline.length; i < len; i++) {
      /**
       * Compare three values and detect the correct distance to represent
       * 1. distance from the point to polyline => d
       * 2. distance from point to start point => dS
       * 3. distance from point to end point => dE
       *
       * step 1 calculate y value on the polyline given x value of pointPosition
       * step 2 if y is between y values of startPoint and endPoint, shortest distance should equal to d
       * step 3 if y is beyond y values of startPoint and endPoint, shortest distance should take the minimum value of dS and dE
       */
      let startPoint = polyline[i - 1],
        endPoint = polyline[i],
        k = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x), // Line slope, k = (y2 - y1) / (x2 - x1)
        A = -k, // Ax + By + C = 0
        B = 1,
        C = k * startPoint.x - startPoint.y,
        yOnPolyline = (-A * pointPosition.x - C) / B; // y = (-A * x - C) / B

      if ((yOnPolyline - startPoint.y) * (yOnPolyline - endPoint.y) < 0) {
        let d = Math.abs((A * pointPosition.x + B * pointPosition.y + C) / Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2))); // Distance |(A * x0+ B * y0 + C) / sqrt(A ^ 2 + B ^ 2)|

        minDistance = minDistance <= d ? minDistance : d;
      } else {
        let dS = Math.sqrt(Math.pow(pointPosition.x - startPoint.x, 2) + Math.pow(pointPosition.y - startPoint.y, 2)), // Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
          dE = Math.sqrt(Math.pow(pointPosition.x - endPoint.x, 2) + Math.pow(pointPosition.y - endPoint.y, 2)), // Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
          shortest = Math.min(dS, dE);

        minDistance = minDistance <= shortest ? minDistance : shortest;
      }
    }

    return minDistance;
  };

  const removeDuplicatedPolylines = (polylines) => {
    const result = [],
      mapping = {}; // Save relation of originalId an index in result array
    
    for (let i = 0, len = polylines.length; i < len; i++) {
      const polyline = polylines[i],
        {originalId} = polyline,
        resultIndex = mapping[originalId]; //Find index of matching line in result array

      if (resultIndex === void 0) { // New polyline should be pushed into the result array
        result.push(polyline);
        mapping[originalId] = result.length - 1;
      } else { // Duplicated polyline should be updated with the minimum distance value
        result[resultIndex].minDistance = Math.min(result[resultIndex].minDistance, polyline.minDistance);
      }
      
    }

    return result;
  };

  const hookOnclick = () => {

    this.map.on('click', (e) => {
      let polyline = [], currentPolyline;

      for(let i = this.polyline.cache.length - 1, len = 0; i >= len; i--) {
        currentPolyline = this.polyline.cache[i];
        
        const minDistance = getMinDistanceToSegmentPolyline(e.pixel, currentPolyline.pixel);

        if (isDistanceUnderBuffer(minDistance)) {
          const originalPolyline = {
            ...mapSegmentToOriginalPolyline(currentPolyline),
            minDistance,
          };
          polyline.push(originalPolyline);
        }
      }

      if (polyline.length !== 0) {
        polyline = removeDuplicatedPolylines(polyline);

        e.polyline = polyline;

        this.options.onClick(e);
      }
    });
  };
  
  const setMapAndDrawOnCondition = () => {
    this.setBoundLngLat();
    this.setMapCentre();
    this.cacheVisiblePolyline();

    if (shouldDrawWithDelay()) {
      drawWithDelay(this.options.algo.delay);
    } else {
      drawWithNoDelay();
    }
  };
  
  const setMapAndDrawInstantly = () => {
    this.setBoundLngLat();
    this.setMapCentre();
    this.cacheVisiblePolyline();

    drawWithNoDelay();
  };
  
  const initRealtimePalette = () => {
    /*
      *draw canvas immediately on page show for the first time
    */
    setMapAndDrawInstantly();

    //this is the best fit from many tests
    this.timerThreshold = 100;
    const delay = new Util.Delay(this.timerThreshold);

    //hook dragging event to redraw canvas
    this.map.on('dragging', () => {

      delay.exec(() => {
        this.setBoundLngLat();
        this.setMapCentre();
        this.cacheVisiblePolyline();

        drawWithNoDelayOnDrag();
      });
    });

    //hook zoom event to redraw canvas
    this.map.on('zoomend', () => {
      setMapAndDrawInstantly();
    });
  };
  
  const init = () => {
    //setting indicator: isInitialLoad
    Util.setIsInitialLoadIndicator.call(this);

    if (isForceRedraw === true) {
      setMapAndDrawOnCondition();

      return;
    }

    if (this.isInitialLoad === true) {
      if (shouldHookOnclick()) {
        hookOnclick();
      }
    }

    if (shouldDrawWithRealtime()) {
      if (this.isInitialLoad === true) {
        initRealtimePalette();
      } else {
        //once zoomend or dragend, reset canvas position to offset margin styles
        Util.resetCanvasPositionAfterDrag(document.getElementById(this.options.id).parentNode);
      }
    } else {
      setMapAndDrawOnCondition();
    }
  };
  
  init();
}

export default {
  importData,
  draw,
  cacheVisiblePolyline,
};