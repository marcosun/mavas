import Util from '../util';
import importData from './common/importData';
import {default as cacheVisiblePolyline} from './common/cacheAlgo';
import setStyleAndStroke from './common/setStyleAndStroke';

/*
  *this is where magic happens
  *@param {Boolean} isForceRedraw [optional: true: force redraw, default to false;]
*/
function draw(isForceRedraw) {
  
  const drawManyCurves = () => {
    let currentLine, currentPoint, previousPoint, currentPixel, previousPixel, centre, r, original, startAngle, endAngle;
    
    this.virtualCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for(let ia = 0, lena = this.curve.cache.length; ia < lena; ia++) {
      currentLine = this.curve.cache[ia];
      this.virtualCtx.beginPath();

      for(let ib = 1, lenb = currentLine.coords.length; ib < lenb; ib++) {
        previousPoint = {
          coords: currentLine.coords[ib - 1],
          lnglat: currentLine.lnglat[ib - 1],
        };
        currentPoint = {
          coords: currentLine.coords[ib],
          lnglat: currentLine.lnglat[ib],
        };
        previousPixel = this.map.lngLatToContainer(previousPoint.lnglat);
        currentPixel = this.map.lngLatToContainer(currentPoint.lnglat);
        
        centre = {
          x: (previousPixel.x + currentPixel.x) / 2,
          y: (previousPixel.y + currentPixel.y) / 2,
        };
        r = Math.sqrt(Math.pow((previousPixel.x - currentPixel.x), 2) + Math.pow((previousPixel.y - currentPixel.y), 2)) / 2;
        original = {
          x: r + centre.x,
          y: centre.y,
        };
        startAngle = Math.atan((currentPixel.y - centre.y) / (currentPixel.x - centre.x)) - Math.atan((original.y - centre.y) / (original.x - centre.x));
        endAngle = startAngle + Math.PI;
        
        this.virtualCtx.arc(centre.x, centre.y, r, startAngle, endAngle, true);
      };
      setStyleAndStroke(this.virtualCtx, currentLine.lineStyle);
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
    let currentLine, currentPoint, previousPoint, currentPixel, previousPixel, centre, r, original, startAngle, endAngle;
    
    const draw = (i) => {
      for(let ia = i * delaySize, lena = (i + 1) * delaySize > this.curve.cache.length ? this.curve.cache.length : (i + 1) * delaySize; ia < lena; ia++) {
        currentLine = this.curve.cache[ia];
        this.virtualCtx.beginPath();

        for(let ib = 1, lenb = currentLine.coords.length; ib < lenb; ib++) {
          previousPoint = {
            coords: currentLine.coords[ib - 1],
            lnglat: currentLine.lnglat[ib - 1],
          };
          currentPoint = {
            coords: currentLine.coords[ib],
            lnglat: currentLine.lnglat[ib],
          };
          previousPixel = this.map.lngLatToContainer(previousPoint.lnglat);
          currentPixel = this.map.lngLatToContainer(currentPoint.lnglat);
          
          centre = {
            x: (previousPixel.x + currentPixel.x) / 2,
            y: (previousPixel.y + currentPixel.y) / 2,
          };
          r = Math.sqrt(Math.pow((previousPixel.x - currentPixel.x), 2) + Math.pow((previousPixel.y - currentPixel.y), 2)) / 2;
          original = {
            x: r + centre.x,
            y: centre.y,
          };
          startAngle = Math.atan((currentPixel.y - centre.y) / (currentPixel.x - centre.x)) - Math.atan((original.y - centre.y) / (original.x - centre.x));
          endAngle = startAngle + Math.PI;

          this.virtualCtx.arc(centre.x, centre.y, r, startAngle, endAngle, true);
        };
        setStyleAndStroke(this.virtualCtx, currentLine.lineStyle);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.virtualCanvas, 0, 0);
      };
    };
    
    let now = new Date();
    let delayInterval = this.options.algo.delay.interval, delaySize = this.options.algo.delay.size, i = 0, len = this.curve.cache.length / delaySize;

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

    if (this.options.algo.delay.size === undefined) {
      drawWithNoDelay();
    } else {
      drawWithDelay(this.options.algo.delay);
    }
    
    return;
  }
  
  if (this.options.algo.isRealtime === true) {
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

    if (this.options.algo.delay.size === undefined) {
      drawWithNoDelay();
    } else {
      drawWithDelay(this.options.algo.delay);
    }
  }
};

export default {
  importData,
  draw,
  cacheVisiblePolyline,
}