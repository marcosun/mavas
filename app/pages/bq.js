import React from 'react';
import request from 'superagent';

import Mavas from '../../lib/mavas/main';
import Util from '../../lib/mavas/util';

//import startIcon from '../image/start.png';
//let startImage = document.createElement('img');
//startImage.src = startIcon;
//import endIcon from '../image/end.png';
//let endImage = document.createElement('img');
//endImage.src = endIcon;

import onboard from '../mockData/onboard';
import dropoff from '../mockData/dropoff';

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class Bq extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.props = props;
//    this.state = {
//      isFetching: true,
//      startTime: '00:00:00',
//      endTime: '23:59:59',
//    };
//    
//    this.delayExecute = new Util.Delay(1000);
//    this.isRelationalVision = false;
    
    this.initIcons();
  }
  
  componentDidMount() {
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 11,
      center: [120.16405,30.254651],
      animateEnable: false,
//      mapStyle: 'amap://styles/darkblue',
    });
    
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
    setTimeout(() => {this.fetchAndDraw();}, 1000);
  }
  
  initIcons() {
    for(let i = 0; i < 10; i++) {
      const iconName = `onboardIcon${i + 1}`;
      const canvas = document.createElement('canvas');
      canvas.width = i * 2 + 2 + 6;
      canvas.height = i * 2 + 2 + 6;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = 'navy';
      ctx.lineWidth = 1;
      ctx.arc(canvas.width / 2, canvas.height / 2, i + 3, 0, 2 * Math.PI);
      ctx.stroke();
      this[iconName] = canvas;
    }
    
    for(let i = 0; i < 10; i++) {
      const iconName = `dropoffIcon${i + 1}`;
      const canvas = document.createElement('canvas');
      canvas.width = i * 2 + 2 + 6;
      canvas.height = i * 2 + 2 + 6;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.arc(canvas.width / 2, canvas.height / 2, i + 3, 0, 2 * Math.PI);
      ctx.stroke();
      this[iconName] = canvas;
    }
  }
  
  fetchAndDraw(isUpdate) {
    this.dataTransformation();
    if (isUpdate === true) {
      this.redraw();
    } else {
      this.draw();
    }
  }
  
  draw() {
//    this.palettePolyline = this.mavas.createLayer({
//      type: 'polyline',
//      id: 'polyline',
//      data: [],
//      lineStyle: {
//        type: 'dash',
//        color: 'red',
//      },
//    });
    
    this.paletteMarker = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: this.markerData,
//      onClick: (e) => {
//        const removeDuplicatedMarker = (marker) => {
//          const isExist = (coords) => {
//            for(let i = 0, len = result.length; i < len; i++) {
//              if(Util.isEqual(coords, result[i].coords)) {
//                return true;
//              }
//              return false;
//            }
//          };
//          
//          let result = [];
//          
//          for(let i = 0, len = marker.length; i < len; i++) {
//            let coords = marker[i].coords;
//            if(!isExist(coords)) {
//              result.push(marker[i]);
//            }
//          }
//          
//          return result;
//        };
//        
//        this.isRelationalVision = !this.isRelationalVision;
//        
//        if (this.isRelationalVision === true) {
//          let targetCoords, matchedList = [];
//          
//          //remove duplicated marker
//          let clickMarkerList = removeDuplicatedMarker(e.marker);
//          
//          for(let ia = clickMarkerList.length - 1; ia >= 0; ia--) {
//            targetCoords = clickMarkerList[ia].coords;
//
//            for(let ib = this.apiData.length - 1; ib >= 0; ib--) {
//              let startCoords = [Number(this.apiData[ib].up_lng), Number(this.apiData[ib].up_lat)],
//                endCoords = [Number(this.apiData[ib].down_lng), Number(this.apiData[ib].down_lat)];
//
//              if(Util.isEqual(targetCoords, startCoords) || Util.isEqual(targetCoords, endCoords)) {
//                matchedList.push(this.apiData[ib]);
//              }
//            }
//          }
//          this.dataTransformation(matchedList);
//        } else {
//          this.dataTransformation(this.apiData);
//          this.makePolylineData([]);
//        }
//        
//        this.updateCurves();
//      },
    });
    
//    this.paletteTooltip = this.mavas.createLayer({
//      type: 'tooltip',
//      data: this.tooltipData,
//      width: 250,
//      cumulative: true,
//    });
    
    this.mavas.draw({
      zIndex: 150,
    });
  }
  
  redraw() {
    this.isRelationalVision = false;
    this.updateCurves();
  }
  
  dataTransformation() {
    //prepare polyline data
//    this.makePolylineData(data);
    //prepare marker data
    this.makeMarkerData();
    //prepare tooltip data
//    this.makeTooltipData(data);
  }
  
  makePolylineData(data) {
    this.polylineData = [];
    
    data.forEach((currentRoute) => {
      this.polylineData.push({
        coords: [[Number(currentRoute.up_lng), Number(currentRoute.up_lat)], [Number(currentRoute.down_lng), Number(currentRoute.down_lat)]],
        symbol: {
          symbol: ['none', 'arrow'],
          size: [10, 10],
          color: 'red',
        },
      });
    });
  }
  
  makeMarkerData() {
    this.markerData = [];
    
    onboard.forEach((marker) => {
      if(this[`onboardIcon${marker.volume / 10 < 10 ? Math.floor(marker.volume / 10 + 1) : 10}`] === undefined) {console.log(marker);};
      this.markerData.push({
        coords: [Number(marker.coords.split(',')[1]), Number(marker.coords.split(',')[0])],
        icon: this[`onboardIcon${marker.volume / 10 < 10 ? Math.floor(marker.volume / 10 + 1) : 10}`],
      });
    });
    
    dropoff.forEach((marker) => {
      this.markerData.push({
        coords: [Number(marker.coords.split(',')[1]), Number(marker.coords.split(',')[0])],
        icon: this[`dropoffIcon${marker.volume / 10 < 10 ? Math.floor(marker.volume / 10 + 1) : 10}`],
      });
    });
  }
  
  makeTooltipData(data) {
    this.tooltipData = [];

    for(let i = 0, len = data.length; i < len; i++) {
      let startCoords = [Number(data[i].up_lng), Number(data[i].up_lat)],
        startStation = data[i].up_address,
        endCoords = [Number(data[i].down_lng), Number(data[i].down_lat)],
        endStation = data[i].down_address,
        num = data[i].num;
      
      this.tooltipData.push({
        coords: startCoords,
        width: startImage.width,
        height: startImage.height,
        desc: `起始站：${startStation}`,
        offsetY: startImage.height / 2,
      });

      this.tooltipData.push({
        coords: endCoords,
        width: startImage.width,
        height: startImage.height,
        desc: `终点站：${endStation}`,
        offsetY: startImage.height / 2,
      });
    }
  }
  
  updateCurves() {
//    this.palettePolyline.updatePalette({
//      type: 'polyline',
//      id: 'polyline',
//      data: this.polylineData,
//      lineStyle: {
//        type: 'dash',
//        color: 'red',
//      },
//    });

//    this.palettePolyline.draw(true);

    this.paletteMarker.updatePalette({
      type: 'marker',
      id: 'marker',
      data: this.markerData,
    });

    this.paletteMarker.draw(true);

//    this.paletteTooltip.updatePalette({
//      type: 'tooltip',
//      data: this.tooltipData,
//    });
//
//    this.paletteTooltip.draw(true);
  }
  
  render() {
    return (
      <div>
        <div className="map-container" id="map" style={{'height': '100vh'}}></div>
      </div>
    );
  }
}