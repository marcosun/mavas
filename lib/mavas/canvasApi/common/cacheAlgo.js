import Util from '../../util';

/*
  *this is where performance enhancement comes in
  *look at my doc for explanation
*/
export default function cacheAlgo() {
  
  let type;
  
  switch(this.options.type) {
    case 'polyline':
      type = 'polyline';
      break;
    case 'curve':
    case 'quadraticCurve':
      type = 'curve';
      break;
  };
  
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
    this[type].cache = [];
    
    const save = (resultLine) => {
      this[type].cache.push({
        coords: Util.pluck(resultLine, 'coords'),
        lnglat: Util.pluck(resultLine, 'lnglat'),
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
        save(resultLine);
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

    this[type].cache = [];

    this[type].original.forEach((eachline) => {
      let result = {
        coords: [],
        lnglat: [],
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
    console.log(`cache function uses ${new Date() - now}ms`);
  };
  
  switch(this.options.algo.cacheAlgo) {
    case '9 blocks':
      nineBlocksAlgorithm();
      break;
    case 'simple':
      simpleAlgorithm();
      break;
  };
};