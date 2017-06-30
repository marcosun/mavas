import Util from '../util';

let isMapMoving = false;

/*
  *@param {Object} data [optional, data: {marker, tooltip}, marker: [[lng, lat], [lng, lat]], lng: Number, lat: Number, tooltip: [tooltipStr, tooltipStr], tooltipStr: String]
*/
function importData(data) {
  
  const save = (data) => {
    for(let i = 0, len = data.location.length; i < len; i ++) {
      let location = data.location[i];

      this.tooltip.original.push({
        location: location,
        lnglat: new AMap.LngLat(location[0], location[1]),
        markerSize: data.markerSize[i],
        desc: data.desc[i],
      });
    };
  };
  
  this.tooltip = {};
  this.tooltip.original = [];
  
  save(data);
};

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
      this.ctx.font = options.font;
      this.ctx.fillStyle = options.color;

      for(let i = 0; i < numberOfLines; i++) {
        deviation = {
          x: options.left + options.padding,
          //the function beflow derives from this function: y: options.padding + i * lineHeight + (lineHeight - fontSize) / 2 + fontSize,
          y: options.padding + (i + 0.5) * lineHeight + fontSize / 2,
        };

        this.ctx.fillText(options.text.slice(i * wordPerLine, (i + 1) * wordPerLine), options.origin.x + deviation.x, options.origin.y + deviation.y);
      };
    };
    
    const drawBackground = () => {
      deviation = {
        x: options.left,
        y: 0,
      };
      
      this.ctx.fillStyle = options.backgroundColor;
      //similar to html box model
      this.ctx.rect(options.origin.x + deviation.x, options.origin.y + deviation.y, options.width + options.padding * 2, lineHeight * numberOfLines + options.padding * 2);
      this.ctx.fill();
    };
    
    const fontSize = Number(options.font.match(/^\d+/)),
          lineHeight = fontSize * options.lineHeight,
          textLength = options.text.length,
          wordPerLine = Math.floor((options.width - options.padding * 2) / fontSize),
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
    this.map.on('movestart', (e) => {
      isMapMoving = true;
    });
    
    this.map.on('moveend', (e) => {
      isMapMoving = false;
    });
    
    this.map.on('mousemove', (e) => {
      const findTooltipOnMouseMove = (currentPoint, i, array) => {
        currentBoundPixel = currentPoint.boundPixel;

        return e.pixel.x <= currentBoundPixel[0] && e.pixel.y >= currentBoundPixel[1] && e.pixel.x >= currentBoundPixel[2] && e.pixel.y <= currentBoundPixel[3];
      };
      
      if (isMapMoving === false) {
        
        if (this.option.cumulative === true) {
          //show all tooltips that covers a certain point
          result = Util.findAll(this.tooltip.cache, findTooltipOnMouseMove);
          
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          if (result.length !== 0) {
            for(let i = 0, len = result.length; i < len; i++) {
              drawLongText({
                text: result[i].desc,
                origin: {
                  x: result[len - 1].boundPixel[0],
                  y: result[len - 1].boundPixel[1] + (this.option.padding * 2 + this.option.lineHeight * Number(this.option.font.match(/^\d+/))) * i,
                },
                left: this.option.left,
                padding: this.option.padding,
                width: this.option.width,
                lineHeight: this.option.lineHeight,
                font: this.option.font,
                color: this.option.color,
                backgroundColor: this.option.backgroundColor,
              });
            };
            
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
              left: this.option.left,
              padding: this.option.padding,
              width: this.option.width,
              lineHeight: this.option.lineHeight,
              font: this.option.font,
              color: this.option.color,
              backgroundColor: this.option.backgroundColor,
            });
          }
        }
      }
    });
  }
};

//simpleAlgorithm
function cacheVisibleTooltip() {
  let now = new Date();
  let tooltip, pixel, lng, lat;
  this.tooltip.cache = [];

  for(let i = 0, len = this.tooltip.original.length; i < len; i ++) {
    tooltip = this.tooltip.original[i];
    lng = tooltip.lnglat.lng;
    lat = tooltip.lnglat.lat;
    
    if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {
      pixel = this.map.lngLatToContainer(tooltip.lnglat);
      
      this.tooltip.cache.push(
        Object.assign(
          {},
          tooltip,
          {
            boundPixel: [pixel.x + tooltip.markerSize.width / 2, pixel.y - tooltip.markerSize.height, pixel.x - tooltip.markerSize.width / 2, pixel.y]
          },
        )
      );
    }
  }
  
  console.log(`cache function uses ${new Date() - now}ms`);
};

export default {
  importData,
  draw,
  cacheVisibleTooltip,
}