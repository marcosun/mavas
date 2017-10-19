import Util from '../../util';

/*
  *this is where performance enhancement comes in
  *look at my doc for explanation
*/
export default function cacheAlgo() {
  
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
  }
  
  //9 blocks algorithm
  const nineBlocksAlgorithm = () => {
    let currentLine, resultLine, currentPoint, previousPoint, positionDiff, r;
    this[type].cache = [];
    
    const save = (resultLine) => {
      this[type].cache.push({
        coords: Util.pluck(resultLine, 'coords'),
        lnglat: Util.pluck(resultLine, 'lnglat'),
        pixel: Util.pluck(resultLine, 'pixel'),
        symbol: currentLine.symbol,
        lineStyle: currentLine.lineStyle,
      });
    };
    
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
        save(resultLine);
        resultLine = [];
      }
      previousPoint = Object.assign({}, currentPoint, {isDrawn: false});
    };

    r = Math.sqrt(Math.pow(this.mapCentre.lng - this.boundLngLat[0], 2) + Math.pow(this.mapCentre.lat - this.boundLngLat[1], 2));
    for(let ia = 0, lena = this[type].original.length; ia < lena; ia++) {
      currentLine = this[type].original[ia];
      resultLine = [];
      
      for(let ib = 1, lenb = currentLine.coords.length; ib < lenb; ib++) {
        if (ib == 1) {
          previousPoint = {
            coords: currentLine.coords[ib - 1],
            lnglat: currentLine.lnglat[ib - 1],
            pixel: this.map.lngLatToContainer(currentLine.lnglat[ib - 1]),
          };
          previousPoint.position = lngLatToBlockPosition(previousPoint.lnglat, this.boundLngLat);

          if (previousPoint.position === 0) {
            previousPoint.isDrawn = true;
            resultLine.push(previousPoint);
          }
        }
        
        currentPoint = {
          coords: currentLine.coords[ib],
          lnglat: currentLine.lnglat[ib],
          pixel: this.map.lngLatToContainer(currentLine.lnglat[ib]),
        };
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
        }

        if (previousPoint.position % 2 !== 0) {
          switch(positionDiff) {
          //rule 3
          case 1:
          case 7:
            dontCache();
            continue;
            //rule 4
          case 4:
            cache();
            continue;
          }
        } else {
          switch(positionDiff) {
          //rule 5
          case 1:
          case 2:
          case 6:
          case 7:
            dontCache();
            continue;
          }
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
      }

      if (resultLine.length !== 0) {
        save(resultLine);
        resultLine = [];
      }

    }
  };
  
  //simple algorithm
  const simpleAlgorithm = () => {
    let boundLngBuffer,
      boundLatBuffer,
      expandedBoundLngLat;

    boundLngBuffer = this.boundLngLat[0] - this.boundLngLat[2];
    boundLatBuffer = this.boundLngLat[1] - this.boundLngLat[3];
    expandedBoundLngLat = [this.boundLngLat[2] - boundLngBuffer, this.boundLngLat[3] - boundLatBuffer, this.boundLngLat[0] + boundLngBuffer, this.boundLngLat[1] + boundLatBuffer];

    this[type].cache = [];

    this[type].original.forEach((eachline) => {
      let result = {
        coords: [],
        lnglat: [],
        symbol: eachline.symbol,
        lineStyle: eachline.lineStyle,
      };

      eachline.lnglat.forEach((lnglat, index) => {
        let lng = lnglat.lng,
          lat = lnglat.lat;
        if (lng >= expandedBoundLngLat[0] && lat >= expandedBoundLngLat[1] && lng <= expandedBoundLngLat[2] && lat <= expandedBoundLngLat[3] ) {
          result.lnglat.push(lnglat);
          result.coords.push(eachline.coords[index]);
        }
      });

      if (result.coords.length !== 0) {
        this[type].cache.push(result);
      }
    });
  };
  
  //simpleAlgorithm
  const cacheVisibleMarkers = () => {
    this.marker.cache = [];

    for(let i = 0, len = this.marker.original.length; i < len; i ++) {
      let marker = this.marker.original[i],
        lng = marker.coords[0],
        lat = marker.coords[1],
        pixel;

      if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {

        pixel = this.map.lngLatToContainer(marker.lnglat);

        this.marker.cache.push(Object.assign({}, marker, {pixel}));
      }
    }
  };
  
  //simpleAlgorithm
  const cacheVisibleTooltip = () => {
    let tooltip, pixel, lng, lat, offsetX, offsetY;
    this.tooltip.cache = [];

    for(let i = 0, len = this.tooltip.original.length; i < len; i ++) {
      tooltip = this.tooltip.original[i];
      lng = tooltip.lnglat.lng;
      lat = tooltip.lnglat.lat;
      offsetX = tooltip.offsetX;
      offsetY = tooltip.offsetY;

      if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {
        pixel = this.map.lngLatToContainer(tooltip.lnglat);

        this.tooltip.cache.push(Object.assign(
          {},
          tooltip,
          {
            boundPixel: [pixel.x - tooltip.width / 2 + offsetX, pixel.y - tooltip.height / 2 - offsetY, pixel.x + tooltip.width / 2 + offsetX, pixel.y + tooltip.height / 2 - offsetY],
          }
        ));
      }
    }
  };
  
  const cacheVisibleLines = () => {
    switch(this.options.algo.cacheAlgo) {
    case '9 blocks':
      nineBlocksAlgorithm();
      break;
    case 'simple':
      simpleAlgorithm();
      break;
    }
  };
  
  const cacheInfoWindow = () => {
    let infoWindow, pixel, lng, lat, offsetX, offsetY;
    this.infoWindow.cache = [];

    for(let i = 0, len = this.infoWindow.original.length; i < len; i++) {
      infoWindow = this.infoWindow.original[i];
      lng = infoWindow.lnglat.lng;
      lat = infoWindow.lnglat.lat;
      offsetX = infoWindow.offsetX;
      offsetY = infoWindow.offsetY;

      if (lng <= this.boundLngLat[0] && lat <= this.boundLngLat[1] && lng >= this.boundLngLat[2] && lat >= this.boundLngLat[3]) {
        pixel = this.map.lngLatToContainer(infoWindow.lnglat);

        this.infoWindow.cache.push({
          ...infoWindow,
          boundPixel: [pixel.x - infoWindow.style.width / 2 + offsetX, pixel.y - infoWindow.style.height - offsetY, pixel.x + infoWindow.style.width / 2 + offsetX, pixel.y + infoWindow.style.height - offsetY]
        });
      }
    }
  };
  
  let type;
  
  switch(this.options.type) {
  case 'polyline':
    type = 'polyline';
    cacheVisibleLines();
    break;
  case 'curve':
  case 'quadraticCurve':
    type = 'curve';
    cacheVisibleLines();
    break;
  case 'marker':
    type = 'marker';
    cacheVisibleMarkers();
    break;
  case 'tooltip':
    type = 'tooltip';
    cacheVisibleTooltip();
    break;
  case 'infoWindow':
    type = 'infoWindow';
    cacheInfoWindow();
    break;
  }
}
