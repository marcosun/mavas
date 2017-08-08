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
      
      this.virtualCtx.drawImage(icon, currentPoint.pixel.x - icon.width / 2, currentPoint.pixel.y - icon.height);
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

      this.virtualCtx.drawImage(icon, currentPoint.pixel.x - icon.width / 2, currentPoint.pixel.y - icon.height);
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.virtualCanvas, 0, 0);
    
    Util.offsetCanvasPositionOnDrag(parentNode);
  };
  
  //setting indicator: isInitialLoad
  Util.setIsInitialLoadIndicator.call(this);
  
  if (this.isInitialLoad === true) {
    if (this.options.onClick) {
      this.map.on('click', (e) => {
        let marker = [], currentPoint, xLength, yLength, northEast, southWest;
        
        for(let i = this.marker.cache.length - 1, len = 0; i >= len; i--) {
          currentPoint = this.marker.cache[i];
          
          //icon border length
          xLength = currentPoint.icon.width;
          yLength = currentPoint.icon.height;
          
          //
          northEast = {
            x: currentPoint.pixel.x + xLength / 2,
            y: currentPoint.pixel.y - yLength,
          };
          
          southWest = {
            x: currentPoint.pixel.x - xLength / 2,
            y: currentPoint.pixel.y,
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
    }
  }
  
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
    return this.options.realtime === true;
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
  
  const init = () => {
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