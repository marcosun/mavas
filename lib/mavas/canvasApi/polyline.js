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
    let currentLine, currentPoint, pixel;
    
    this.virtualCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for(let ia = 0, lena = this.polyline.cache.length; ia < lena; ia++) {
      currentLine = this.polyline.cache[ia];
      this.virtualCtx.beginPath();

      for(let ib = 0, lenb = currentLine.coords.length; ib < lenb; ib++) {
        currentPoint = {
          coords: currentLine.coords[ib],
          lnglat: currentLine.lnglat[ib],
        };
        pixel = this.map.lngLatToContainer(currentPoint.lnglat);
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
    let now = new Date();
    
    drawManyPolylines();
    
    console.log(`canvas api uses ${new Date() - now}ms`);
  };
  
  /*
    *draw lines with delay
    @param {{interval: Number, size: Number}} delay [compulsory]
  */
  const drawWithDelay = () => {
    let currentLine, currentPoint, pixel;
    
    const draw = (i) => {
      for(let ia = i * delaySize, lena = (i + 1) * delaySize > this.polyline.cache.length ? this.polyline.cache.length : (i + 1) * delaySize; ia < lena; ia++) {
        currentLine = this.polyline.cache[ia];
        this.virtualCtx.beginPath();

        for(let ib = 0, lenb = currentLine.coords.length; ib < lenb; ib++) {
          currentPoint = {
            coords: currentLine.coords[ib],
            lnglat: currentLine.lnglat[ib],
          };
          pixel = this.map.lngLatToContainer(currentPoint.lnglat);
          this.virtualCtx.lineTo(pixel.x, pixel.y);
        }
        setStyleAndStroke(this.virtualCtx, currentLine.lineStyle);
        drawWithSymbol(this.virtualCtx, currentLine.symbol, this.map.lngLatToContainer(currentLine.lnglat[0]), this.map.lngLatToContainer(currentLine.lnglat[currentLine.lnglat.length - 1]));
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.virtualCanvas, 0, 0);
      }
    };
    
    let now = new Date();
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
    console.log(`canvas api uses ${new Date() - now}ms`);
  };
  
  const drawWithNoDelayOnDrag = () => {
    let now = new Date();
    let parentNode = document.getElementById(this.options.id).parentNode;
    
    drawManyPolylines();
    
    Util.offsetCanvasPositionOnDrag(parentNode);
    
    console.log(`canvas api uses ${new Date() - now}ms`);
  };
  
  const shouldDrawWithDelay = () => {
    this.options.algo.delay.size !== undefined;
  };
  
  const shouldDrawWithRealtime = () => {
    this.options.algo.isRealtime === true;
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
  
  //setting indicator: isInitialLoad
  Util.setIsInitialLoadIndicator.call(this);
  
  if (isForceRedraw === true) {
    setMapAndDrawOnCondition();
    
    return;
  }
  
  if (shouldDrawWithRealtime()) {
    if (this.isInitialLoad === true) {
      
      //this is the best fit from many tests
      this.timerThreshold = 100;
      
      /*
        *draw canvas immediately on page show for the first time
      */
      setMapAndDrawInstantly();
      
      //hook dragging event to redraw canvas
      this.map.on('dragging', () => {
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
      this.map.on('zoomend', () => {
        setMapAndDrawInstantly();
        
        this.lastTimer = new Date();
      });
      
    } else {
      //once zoomend or dragend, reset canvas position to offset margin styles
      Util.resetCanvasPositionAfterDrag(document.getElementById(this.options.id).parentNode);
      this.lastTimer = new Date();
    }
  } else {
    setMapAndDrawOnCondition();
  }
}

export default {
  importData,
  draw,
  cacheVisiblePolyline,
};