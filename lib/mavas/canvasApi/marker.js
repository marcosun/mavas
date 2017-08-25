import Util from '../util';
import importData from './common/importData';
import {default as cacheVisibleMarker} from './common/cacheAlgo';

/*
  *this is where magic happens
  *@param {Boolean} isForceRedraw [optional: true: force redraw, default to false;]
*/
function draw(isForceRedraw) {
  let currentPoint;
  
  //virtual canvas buffer
  const drawBubbles = () => {
    let icon;
    
    this.virtualCtx.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
    
    for(let i = 0, len = this.marker.cache.length; i < len; i ++) {
      currentPoint = this.marker.cache[i];
      icon = currentPoint.icon;
      
      this.virtualCtx.drawImage(icon, currentPoint.pixel.x + currentPoint.originOffsetX, currentPoint.pixel.y - currentPoint.originOffsetY);
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
  };
  
  const drawBubblesOnDrag = () => {
    let icon,
      parentNode = document.getElementById(this.options.id).parentNode;
    
    this.virtualCtx.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
    
    for(let i = 0, len = this.marker.cache.length; i < len; i ++) {
      currentPoint = this.marker.cache[i];
      icon = currentPoint.icon;

      this.virtualCtx.drawImage(icon, currentPoint.pixel.x + currentPoint.originOffsetX, currentPoint.pixel.y - currentPoint.originOffsetY);
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
    
    Util.offsetCanvasPositionOnDrag(parentNode);
  };
  
  const setMapAndDrawInstantly = () => {
    //cache visible data
    this.setBoundLngLat();
    this.cacheVisibleMarker();
    
    drawBubbles();
  };
  
  const setMapAndDrawOnDrag = () => {
    //cache visible data
    this.setBoundLngLat();
    this.cacheVisibleMarker();

    drawBubblesOnDrag();
  };
  
  const shouldDrawWithRealtime = () => {
    return this.options.algo.isRealtime === true;
  };
  
  const shouldHookOnclick = () => {
    return this.options.onClick instanceof Function;
  };
  
  const initRealtimePalette = () => {
    /*
      *draw canvas immediately on page show for the first time
    */
    //cache visible data
    setMapAndDrawInstantly();

    //this is the best fit from many tests
    this.timerThreshold = 100;
    const delay = new Util.Delay(this.timerThreshold);

    //hook dragging event to redraw canvas
    this.map.on('dragging', () => {
      delay.exec(() => {
        setMapAndDrawOnDrag();
      });
    });

    //hook zoom event to redraw canvas
    this.map.on('zoomend', () => {
      setMapAndDrawOnDrag();
    });
  };
  
  const hookOnclick = () => {
    this.map.on('click', (e) => {
      let marker = [], currentPoint, offsetX, offsetY, xLength, yLength, northEast, southWest;

      for(let i = this.marker.cache.length - 1, len = 0; i >= len; i--) {
        currentPoint = this.marker.cache[i];

        //offset
        offsetX = currentPoint.offsetX;
        offsetY = currentPoint.offsetY;
        
        //icon border length
        xLength = currentPoint.icon.width;
        yLength = currentPoint.icon.height;

        //
        northEast = {
          x: currentPoint.pixel.x + xLength / 2 + offsetX,
          y: currentPoint.pixel.y - yLength / 2 - offsetY,
        };

        southWest = {
          x: currentPoint.pixel.x - xLength / 2 + offsetX,
          y: currentPoint.pixel.y + yLength / 2 - offsetY,
        };

        if (e.pixel.x <= northEast.x && e.pixel.y >= northEast.y && e.pixel.x >= southWest.x && e.pixel.y <= southWest.y) {
          marker.push(currentPoint);
        }
      }

      if (marker.length !== 0) {
        e.marker = marker;

        this.options.onClick(e);
      }
    });
  };
  
  const init = () => {
    //setting indicator: isInitialLoad
    Util.setIsInitialLoadIndicator.call(this);

    if (this.isInitialLoad === true) {
      if (shouldHookOnclick()) {
        hookOnclick();
      }
    }
    
    if (isForceRedraw === true) {
      setMapAndDrawInstantly();

      return;
    }

    if (shouldDrawWithRealtime()) {
      if (this.isInitialLoad === true) {
        initRealtimePalette();

      } else {
        //once zoomend or dragend, reset canvas position to offset margin styles
        Util.resetCanvasPositionAfterDrag(document.getElementById(this.options.id).parentNode);
      }
    } else {
      setMapAndDrawInstantly();
    }
  };
  
  init();

}

export default {
  importData,
  draw,
  cacheVisibleMarker,
};