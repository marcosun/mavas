import Util from '../util';
import importData from './common/importData';
import {default as cacheVisibleTooltip} from './common/cacheAlgo';

let isMapMoving = false;

/*
  *this is where magic happens
*/
function draw() {
  const drawLongText = (options) => {
    /*
    options = {
      text: String,
      origin: {
        x: Number,
        y: Number,
      },
      left: Number,
      padding: Number,
      width: Number,
      font: String, //accept monospaced fonts only, otherwise it would be very difficult to calculate length of each character and therefore ugly interface
    };
    */
    
    const drawText = () => {
      this.ctx.font = options.style.font;
      this.ctx.fillStyle = options.style.color;

      for(let i = 0; i < numberOfLines; i++) {
        deviation = {
          x: options.style.left + options.style.padding,
          //the function beflow derives from this function: y: options.style.padding + i * lineHeight + (lineHeight - fontSize) / 2 + fontSize,
          y: options.style.padding + (i + 0.5) * lineHeight + fontSize / 2,
        };

        this.ctx.fillText(options.text.slice(i * wordPerLine, (i + 1) * wordPerLine), options.origin.x + deviation.x, options.origin.y + deviation.y);
      }
    };
    
    const drawBackground = () => {
      deviation = {
        x: options.style.left,
        y: 0,
      };
      
      this.ctx.fillStyle = options.style.backgroundColor;
      //similar to html box model
      this.ctx.rect(options.origin.x + deviation.x, options.origin.y + deviation.y, options.style.width + options.style.padding * 2, lineHeight * numberOfLines + options.style.padding * 2);
      this.ctx.fill();
    };
    
    const fontSize = Number(options.style.font.match(/^\d+/)),
      lineHeight = fontSize * options.style.lineHeight,
      textLength = options.text.length,
      wordPerLine = Math.floor((options.style.width - options.style.padding * 2) / fontSize),
      numberOfLines = Math.ceil(textLength / wordPerLine);
    
    let deviation;
    
    this.ctx.beginPath();
    drawBackground();
    drawText();
  };
  
  let currentBoundPixel, result;
  
  Util.setIsInitialLoadIndicator.call(this);
  
  //cache visible data
  this.setBoundLngLat();
  this.cacheVisibleTooltip();
  
  //bind event only once!
  if (this.isInitialLoad === true) {
    this.map.on('movestart', () => {
      isMapMoving = true;
    });
    
    this.map.on('moveend', () => {
      isMapMoving = false;
    });
    
    this.map.on('mousemove', (e) => {
      const findTooltipOnMouseMove = (currentPoint) => {
        currentBoundPixel = currentPoint.boundPixel;

        return e.pixel.x <= currentBoundPixel[0] && e.pixel.y >= currentBoundPixel[1] && e.pixel.x >= currentBoundPixel[2] && e.pixel.y <= currentBoundPixel[3];
      };
      
      if (isMapMoving === false) {
        
        if (this.options.cumulative === true) {
          //show all tooltips that covers a certain point
          result = Util.findAll(this.tooltip.cache, findTooltipOnMouseMove);
          
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          if (result.length !== 0) {
            for(let i = 0, len = result.length; i < len; i++) {
              drawLongText({
                text: result[i].desc,
                origin: {
                  x: result[len - 1].boundPixel[0],
                  y: result[len - 1].boundPixel[1] + (result[i].style.padding * 2 + result[i].style.lineHeight * Number(result[i].style.font.match(/^\d+/))) * i,
                },
                style: result[i].style,
              });
            }
            
          }
        } else {
          //show the last tooltip that covers a certain point
          result = Util.findLast(this.tooltip.cache, findTooltipOnMouseMove);
          
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          if (result) {
            
            drawLongText({
              text: result.desc,
              origin: {
                x: result.boundPixel[0],
                y: result.boundPixel[1],
              },
              style: result.style,
            });
          }
        }
      }
    });
  }
}

export default {
  importData,
  draw,
  cacheVisibleTooltip,
};