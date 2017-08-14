import React from 'react';
import request from 'superagent';

import Mavas from '../../lib/mavas/main';
import Util from '../../lib/mavas/util';

import balloonIcon from '../image/balloon.png';
let balloonImage = document.createElement('img');
balloonImage.src = balloonIcon;

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class OriginDestinationSummary extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.props = props;
    this.state = {
      isFetching: true,
      startTime: '00:00:00',
      endTime: '23:59:59',
    };
    
    this.delayExecute = new Util.Delay(1000);
    this.isRelationalVision = false;
  }
  
  componentDidMount() {
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 11,
      center: [120.16405,30.254651],
      animateEnable: false,
      mapStyle: 'amap://styles/darkblue',
    });
    
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
    this.fetchAndDraw();
  }
  
  fetchAndDraw(isUpdate) {
    this.fetchData()
      .then((res) => {
        this.setState({
          ...this.state,
          isFetching: false,
        });
        this.apiData = res.body;
        this.dataTransformation(this.apiData);
        if (isUpdate === true) {
          this.redraw();
        } else {
          this.draw();
        }
      });
  }
  
  fetchData() {
    this.setState({
      ...this.state,
      isFetching: true,
    });
    
    return request.get(`${__API_ROOT__}/odByTime`)
      .query({
        startTime: this.state.startTime,
        endTime: this.state.endTime,
      });
  }
  
  draw() {
    this.palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: [],
      lineStyle: {
        type: 'dash',
        color: '#00FFFF',
      },
    });
    
    this.paletteMarker = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: this.markerData,
      onClick: (e) => {
        const removeDuplicatedMarker = (marker) => {
          const isExist = (coords) => {
            for(let i = 0, len = result.length; i < len; i++) {
              if(Util.isEqual(coords, result[i].coords)) {
                return true;
              }
              return false;
            }
          };
          
          let result = [];
          
          for(let i = 0, len = marker.length; i < len; i++) {
            let coords = marker[i].coords;
            if(!isExist(coords)) {
              result.push(marker[i]);
            }
          }
          
          return result;
        };
        
        this.isRelationalVision = !this.isRelationalVision;
        
        if (this.isRelationalVision === true) {
          let uniqueClickedMarker = [], targetCoords, matchedList = [], lines, tooltipSource = [];
          
          //remove duplicated marker
          let clickMarkerList = removeDuplicatedMarker(e.marker);
          
          for(let ia = clickMarkerList.length - 1; ia >= 0; ia--) {
            targetCoords = clickMarkerList[ia].coords;

            for(let ib = this.apiData.length - 1; ib >= 0; ib--) {
              let startCoords = this.apiData[ib].startLocation.coordinates,
                endCoords = this.apiData[ib].endLocation.coordinates;

              if(Util.isEqual(targetCoords, startCoords) || Util.isEqual(targetCoords, endCoords)) {
                matchedList.push(this.apiData[ib]);
              }
            }
          }
          this.dataTransformation(matchedList);
        } else {
          this.dataTransformation(this.apiData);
          this.makePolylineData([]);
        }
        
        this.updateCurves();
      },
    });
    
//    this.paletteTooltip = this.mavas.createLayer({
//      type: 'tooltip',
//      data: {
//        coords: this.markerData,
//        size: new Array(this.markerData.length).fill({width: balloonImage.width, height: balloonImage.height,}),
//        desc: this.tooltipData,
//      },
//      cumulative: true,
//      width: 250,
//    });
    
    this.timeAxis = this.mavas.createComponent({
      type: 'timeAxis',
      id: 'time-axis',
      data: this.timeAxisData,
      onDrag: (e, timeAxis) => {
        
        this.setState({
          ...this.state,
          startTime: timeAxis.labelLeft.text,
          endTime: timeAxis.labelRight.text,
        });

        this.delayExecute.exec(this.fetchAndDraw.bind(this, true));
      },
      width: document.getElementById('time-axis').clientWidth,
    });
    
    this.mavas.draw({
      zIndex: 150,
    });
  }
  
  redraw() {
    this.isRelationalVision = false;
    this.updateCurves();
  }
  
  dataTransformation(data) {
    //prepare time axis
    this.makeTimeAxisData();
    //prepare polyline data
    this.makePolylineData(data);
    //prepare marker data
    this.makeMarkerData(data);
    //prepare tooltip data
    this.makeTooltipData(data);
  }
  
  makeTimeAxisData() {
    this.timeAxisData = new Array(145);

    for (let i = 0; i < 144; i++) {
      this.timeAxisData[i] = `${Math.floor(i / 6).toString().length === 1 ? '0' + Math.floor(i / 6) : Math.floor(i / 6)}:${i % 6}0:00`;
    }

    this.timeAxisData[144] = '23:59:59';
  }
  
  makePolylineData(data) {
    this.polylineData = [];
    
    data.forEach((currentRoute) => {
      this.polylineData.push({
        coords: [[currentRoute.startLocation.x, currentRoute.startLocation.y], [currentRoute.endLocation.x, currentRoute.endLocation.y]],
        symbol: {
          symbol: ['none', 'arrow'],
          size: [10, 10],
          color: '#00FFFF',
        },
      });
    });
  }
  
  makeMarkerData(data) {
    this.markerData = [];

    data.forEach((currentRoute) => {
      this.markerData.push({coords: [currentRoute.startLocation.x, currentRoute.startLocation.y], icon: balloonImage});
      this.markerData.push({coords: [currentRoute.endLocation.x, currentRoute.endLocation.y], icon: balloonImage});
    });
  }
  
  makeTooltipData(data) {
    this.tooltipData = [];
    
    let startStation = Util.pluck(data, 'startStation');
    let endStation = Util.pluck(data, 'endStation');
    let num = Util.pluck(data, 'num');

    for(let i = 0, len = startStation.length; i < len; i++) {
      this.tooltipData.push(`起始站：${startStation[i]}，人数：${num[i]}`);
      this.tooltipData.push(`终点站：${endStation[i]}，人数：${num[i]}`);
    }
  }
  
  updateCurves() {
    console.log(this.polylineData);
    this.palettePolyline.updatePalette({
      type: 'polyline',
      id: 'polyline',
      data: this.polylineData,
      lineStyle: {
        type: 'dash',
        color: '#00FFFF',
      },
    });

    this.palettePolyline.draw(true);

    this.paletteMarker.updatePalette({
      type: 'marker',
      id: 'marker',
      data: this.markerData,
    });

    this.paletteMarker.draw(true);

//    this.paletteTooltip.import({
//      coords: this.markerData,
//      size: new Array(this.markerData.length).fill({width: balloonImage.width, height: balloonImage.height,}),
//      desc: this.tooltipData,
//    });
//
//    this.paletteTooltip.draw(true);
  }
  
  render() {
    return (
      <div>
        <h1>Origin Destination Summary</h1>
        <strong>请求API状态：<em>{this.state.isFetching ? '正在请求' : '请求成功'}</em></strong>
        <strong style={{'color': 'red', 'marginLeft': '30px'}}>点击气泡看看？</strong>
        <div style={{'padding': '20px 0'}}>
          <canvas id="time-axis" style={{'width': '100%'}}></canvas>
        </div>
        <div className="map-container" id="map" style={{'height': 'calc(100vh - 200px)'}}></div>
      </div>
    );
  }
}