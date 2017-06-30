import React from 'react';
import echarts from 'echarts';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

import startIcon from './image/start.png';
import endIcon from './image/end.png';

let startImage = document.createElement('img'),
    endImage = document.createElement('img');

startImage.src = startIcon;
endImage.src = endIcon;

let isRelationalVision = false;

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
    };
  };
  
  componentDidMount() {
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 16,
      center: [120.131537, 30.281016],
      animateEnable: false,
    });
    
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
    var request = new XMLHttpRequest();
    request.open('GET', 'http://10.85.1.171:8080/od', true);
    request.send();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200){
        this.setState({
          isFetching: false,
        });
        this.mockData = JSON.parse(request.response);
        this.dataTransformation(this.mockData);
        this.draw();
      };
    };
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
      type: 'curve',
      id: 'curve',
      data: {
        location: [],
      },
      realtime: true,
      color: 'blue',
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
        
        isRelationalVision = !isRelationalVision;
        
        if (isRelationalVision === true) {
          
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
    
    this.mavas.draw({
      zIndex: 150,
    });
  };
  
  dataTransformation(apiData) {
    this.makePolylineData(apiData);
    this.makeMarkerData();
    this.makeIconData();
    this.makeTooltipData(this.mockData);
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
        <div className="map-container" id="map" style={{'height': 'calc(100vh - 110px)'}}></div>
      </div>
    );
  };
};