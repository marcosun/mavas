import markerImg from '../../image/marker_default.png';

//load default marker icon
let defaultMarker = document.createElement('img');
defaultMarker.src = markerImg;

export default function importData(data) {
  const saveLines = (data) => {
    let currentLine, currentPoint, newCurrentLine;
    
    for(let ia = 0, lena = data.length; ia < lena; ia++) {
      currentLine = data[ia];
      newCurrentLine = Object.assign(
        {},
        data[ia],
        {
          lnglat: [],
          originalId: ia,
        }
      );

      for(let ib = 0, lenb = currentLine.coords.length; ib < lenb; ib++) {
        currentPoint = currentLine.coords[ib];

        newCurrentLine.lnglat.push(new window.AMap.LngLat(currentPoint[0], currentPoint[1]));
      }

      this[type].original.push(newCurrentLine);
    }
  };
  
  const saveMarkers = (data) => {
    let userDefinedIcon,
      coords,
      offsetX,
      offsetY,
      originOffsetX,
      originOffsetY,
      flagDesc,
      markerCanvas,
      markerCtx,
      textPixel = {
        x: null,
        y: null,
      };
    
    const createDefaultIcon = () => {
      //default icon: blue balloon with black auto increment number
      markerCanvas = document.createElement('canvas');
      markerCanvas.width = defaultMarker.width;
      markerCanvas.height = defaultMarker.height;
      markerCtx = markerCanvas.getContext('2d');
    };
    
    for(let i = 0, len = data.length; i < len; i ++) {
      coords = data[i].coords;
      offsetX = data[i].offsetX;
      offsetY = data[i].offsetY;
      userDefinedIcon = data[i].icon;

      if (userDefinedIcon) {
        //use canvas without any configuration
        markerCanvas = userDefinedIcon;
        //use user defined offset value
        originOffsetX = data[i].offsetX - userDefinedIcon.width / 2;
        originOffsetY = data[i].offsetY + userDefinedIcon.height / 2;
      } else {
        //reposition default marker
        originOffsetX = - defaultMarker.width / 2;
        originOffsetY = defaultMarker.height;
        
        createDefaultIcon();

        markerCtx.drawImage(defaultMarker, 0, 0);

        //flag now default to AI ids starting from 0
        flagDesc = i.toString();

        //position text on the centre of the defaultMarker
        switch(flagDesc.length) {
        case 1:
          textPixel.x = defaultMarker.width / 2 - 3;
          textPixel.y = defaultMarker.height / 2 - 2;
          break;
        case 2:
          textPixel.x = defaultMarker.width / 2 - 6;
          textPixel.y = defaultMarker.height / 2 - 2;
          break;
        default:
          textPixel.x = defaultMarker.width / 2 - 9;
          textPixel.y = defaultMarker.height / 2 - 2;
        }
        markerCtx.fillText(flagDesc, textPixel.x, textPixel.y);
      }

      this[type].original.push({
        coords,
        icon: markerCanvas,
        lnglat: new window.AMap.LngLat(coords[0], coords[1]),
        offsetX,
        offsetY,
        originOffsetX,
        originOffsetY,
      });
    }
  };
  
  const saveTooltip = (data) => {
    for(let i = 0, len = data.length; i < len; i ++) {
      const coords = data[i].coords;

      this.tooltip.original.push(Object.assign(
        {},
        data[i],
        {
          lnglat: new window.AMap.LngLat(coords[0], coords[1]),
        }
      ));
    }
  };
  
  const saveInfoWindow = (data) => {
    for(let i = 0, len = data.length; i < len; i ++) {
      const coords = data[i].coords;
      
      this.infoWindow.original.push({
        coords,
        lnglat: new window.AMap.LngLat(coords[0], coords[1]),
        offsetX: data[i].offsetX,
        offsetY: data[i].offsetY,
        style: {
          ...data[i].style,
          fontSize: data[i].style.font.match(/^\d*/)[0],
        },
        content: data[i].content,
      });
    }
  };
  
  const initOriginalData = (type) => {
    this[type] = {};
    this[type].original = [];
  };
  
  //modify structure and save to original
  let type;
  
  switch(this.options.type) {
  case 'polyline':
    type = 'polyline';
    initOriginalData(type);
    saveLines(data);
    break;
  case 'curve':
  case 'quadraticCurve':
    type = 'curve';
    initOriginalData(type);
    saveLines(data);
    break;
  case 'marker':
    type = 'marker';
    initOriginalData(type);
    saveMarkers(data);
    break;
  case 'tooltip':
    type = 'tooltip';
    initOriginalData(type);
    saveTooltip(data);
    break;
  case 'infoWindow':
    type = 'infoWindow';
    initOriginalData(type);
    saveInfoWindow(data);
    break;
  }
}