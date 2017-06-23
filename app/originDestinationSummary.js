import React from 'react';
import echarts from 'echarts';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

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
    request.open('GET', 'http://10.88.1.227:8080/od', true);
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
    let palette, polylinePalette, markerPalette, tooltipPalette;
    
    polylinePalette = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: this.data,
      realtime: true,
      color: 'red',
    });
    
    palette = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: (() => {
        let result = [];
        
        this.data.forEach((currentLine) => {
          result.push(currentLine[0]);
          result.push(currentLine[1]);
        });
        
        return result;
      })(),
      tooltip: (() => {
        let result = [];
        
        let startStation = Util.pluck(this.mockData, 'startStation');
        let endStation = Util.pluck(this.mockData, 'endStation');
        let num = Util.pluck(this.mockData, 'num');
        
        for(let i = 0, len = startStation.length; i < len; i++) {
          result.push(`起始站：${startStation[i]}，人数：${num[i]}`);
          result.push(`终点站：${endStation[i]}，人数：${num[i]}`);
        };
        
        return result;
      })(),
    });
    
    markerPalette = palette.palette;
    tooltipPalette = palette.paletteTooltip;
    
    this.mavas.draw({
      zIndex: 150,
    });
  };
  
  dataTransformation(apiData) {
    this.data = [];
    
    apiData.forEach((currentRoute) => {
      this.data.push([[currentRoute.startLocation.x, currentRoute.startLocation.y], [currentRoute.endLocation.x, currentRoute.endLocation.y]]);
    });
    
    return this.data;
  };
  
  render() {
    return (
      <div>
        <h1>Origin Destination Summary</h1>
        <strong>请求API状态：<em>{this.state.isFetching ? '正在请求' : '请求成功'}</em></strong>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};