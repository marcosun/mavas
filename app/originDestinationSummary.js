import React from 'react';
import echarts from 'echarts';
import request from 'superagent';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

import startIcon from './image/start.png';
import endIcon from './image/end.png';

let startImage = document.createElement('img'),
    endImage = document.createElement('img');

startImage.src = startIcon;
endImage.src = endIcon;

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
  };
  
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
  };
  
  fetchAndDraw(isUpdate) {
    this.fetchData()
      .then((res) => {
        this.setState({
          ...this.state,
          isFetching: false,
        });
        this.mockData = res.body;
        this.dataTransformation(this.mockData);
        if (isUpdate === true) {
          this.redraw();
        } else {
          this.draw();
        }
      });
  };
  
  fetchData() {
    this.setState({
      ...this.state,
      isFetching: true,
    });
    
    return request.get('http://10.85.1.171:8080/odByTime')
      .query({
        startTime: this.state.startTime,
        endTime: this.state.endTime,
      });
  };
  
  draw() {
    
    this.palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: {
        location: this.polylineData,
      },
      realtime: true,
      color: 'red',
    });
    
    this.paletteCurve = this.mavas.createLayer({
      type: 'quadraticCurve',
      id: 'quadraticCurve',
      data: {
        location: [],
      },
      realtime: true,
      color: '#00FFFF',
    });
    
    this.paletteMarker = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: {
        location: this.markerData,
        icon: this.iconData,
      },
      realtime: true,
      onClick: (e) => {
        
        this.isRelationalVision = !this.isRelationalVision;
        
        if (this.isRelationalVision === true) {
          
          let location, result = [], lines, tooltipSource = [];

          for(let len = e.marker.length, i = len - 1; i >= 0; i--) {
            location = e.marker[i].location;

            //push index of founded line into the result
            result.push(Util.findIndex(this.polylineData, (element, index) => {
              //check both starting and ending points
              return element.find((e) => {
                return e[0] === location[0] && e[1] === location[1];
              }) !== undefined ? true : false;
            }));
          };

          lines = Util.unique(Util.flatten(result));
          lines = lines.sort((a, b) => {return a > b});
          
          (() => {
            let result = [];
            
            for(let i = 0, len = lines.length; i < len; i++) {
              result.push(this.polylineData[lines[i]]);
              tooltipSource.push(this.mockData[lines[i]]);
            }
            
            this.polylineData = result;
          })();
          
          this.makeMarkerData();
          this.makeIconData();
          this.makeTooltipData(tooltipSource);
          
          this.showCurves();
          
        } else {
          
          this.dataTransformation(this.mockData);
          
          this.showPolylines();
          
        }
      },
    });
    
    this.paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: {
        location: this.markerData,
        markerSize: new Array(this.markerData.length).fill({width: startImage.width, height: startImage.height,}),
        desc: this.tooltipData,
      },
      cumulative: true,
      width: 250,
    });
    
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
  };
  
  redraw() {
    this.isRelationalVision = false;
    this.showPolylines();
  };
  
  
  dataTransformation(apiData) {
    this.makeTimeAxisData();
    this.makePolylineData(apiData);
    this.makeMarkerData();
    this.makeIconData();
    this.makeTooltipData(this.mockData);
  };
  
  makeTimeAxisData() {
    this.timeAxisData = new Array(145);

    for (let i = 0; i < 144; i++) {
      this.timeAxisData[i] = `${Math.floor(i / 6).toString().length === 1 ? '0' + Math.floor(i / 6) : Math.floor(i / 6)}:${i % 6}0:00`;
    }

    this.timeAxisData[144] = '23:59:59';
  };
  
  makePolylineData(apiData) {
    this.polylineData = [];
    
    apiData.forEach((currentRoute) => {
      this.polylineData.push([[currentRoute.startLocation.x, currentRoute.startLocation.y], [currentRoute.endLocation.x, currentRoute.endLocation.y]]);
    });
  };
  
  makeMarkerData() {
    this.markerData = [];

    this.polylineData.forEach((currentLine) => {
      this.markerData.push(currentLine[0]);
      this.markerData.push(currentLine[1]);
    });
  };
  
  makeIconData() {
    this.iconData = [];

    for(let i = 0, len = this.polylineData.length; i < len; i++) {
      this.iconData.push(startImage);
      this.iconData.push(endImage);
    }
  };
  
  makeTooltipData(data) {
    this.tooltipData = [];
    
    let startStation = Util.pluck(data, 'startStation');
    let endStation = Util.pluck(data, 'endStation');
    let num = Util.pluck(data, 'num');

    for(let i = 0, len = startStation.length; i < len; i++) {
      this.tooltipData.push(`起始站：${startStation[i]}，人数：${num[i]}`);
      this.tooltipData.push(`终点站：${endStation[i]}，人数：${num[i]}`);
    };
  };
  
  showCurves() {
    this.palettePolyline.importData({
      location: [],
    });

    this.palettePolyline.draw(true);
    
    this.paletteCurve.importData({
      location: this.polylineData,
    });

    this.paletteCurve.draw(true);

    this.paletteMarker.importData({
      location: this.markerData,
      icon: this.iconData,
    });

    this.paletteMarker.draw(true);

    this.paletteTooltip.importData({
      location: this.markerData,
      markerSize: new Array(this.markerData.length).fill({width: startImage.width, height: startImage.height,}),
      desc: this.tooltipData,
    });

    this.paletteTooltip.draw(true);
  };
  
  showPolylines() {

    this.palettePolyline.importData({
      location: this.polylineData,
    });

    this.palettePolyline.draw(true);
    
    this.paletteCurve.importData({
      location: [],
    });

    this.paletteCurve.draw(true);

    this.paletteMarker.importData({
      location: this.markerData,
      icon: this.iconData,
    });

    this.paletteMarker.draw(true);

    this.paletteTooltip.importData({
      location: this.markerData,
      markerSize: new Array(this.markerData.length).fill({width: startImage.width, height: startImage.height,}),
      desc: this.tooltipData,
    });

    this.paletteTooltip.draw(true);
  };
  
  render() {
    return (
      <div>
        <h1>Origin Destination Summary</h1>
        <strong>请求API状态：<em>{this.state.isFetching ? '正在请求' : '请求成功'}</em></strong>
        <strong style={{'color': 'red', 'marginLeft': '30px'}}>点击气泡看看？</strong>
        <canvas id="time-axis" style={{'width': '100%', 'padding': '20px 0'}}></canvas>
        <div className="map-container" id="map" style={{'height': 'calc(100vh - 200px)'}}></div>
      </div>
    );
  };
};