import React from 'react';
import request from 'superagent';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

export default class Heatmap extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isFetching: true,
    };
    this.baseHeatmapOptions = {
      radius: 7, //给定半径
      gradient: {
//        '0.4': '#01579b',
//        '0.7': '#0277bd',
//        '0.8': '#0288d1',
//        '1.0': 'white',
        '0.4': '#4d69ff',
        '0.7': '#4d73ff',
        '0.8': '#6889ff',
        '1.0': 'white',
      },
      opacity: [0.2, 0.8],
    };
  };
  
  componentDidMount() {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 15);
    this.endDate = new Date();
    
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 12,
      center: [120.16405,30.254651],
      animateEnable: true,
      mapStyle: 'amap://styles/darkblue',
    });
    
    this.mavas.map.on('zoomchange', (e) => {
      const zoomLevel = this.mavas.map.getZoom(),
        radius = this.mapZoomToRadius(zoomLevel);
      console.log(zoomLevel);
      console.log(radius);
      this.heatmap.setOptions({
        ...this.baseHeatmapOptions,
        radius: radius,
      });
    });
    
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.Heatmap'], () => {});
    
    return request.get('http://10.85.1.171:8080/groupByStation')
      .query({
        startDate: `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`,
        endDate: `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`,
      })
      .then((res) => {
        this.setState({
          isFetching: false,
        });
        this.dataTransformation(res.body);
        this.draw();
      });
  };
  
  draw() {
    this.heatmap = new AMap.Heatmap(this.mavas.map, this.baseHeatmapOptions);
    
    const mean = Util.pluck(this.data, 'count').reduce((sum, number) => {return sum + number}) / this.data.length,
      std = Math.sqrt(Util.pluck(this.data, 'count').reduce((sum, number) => {return sum + Math.pow(number - mean, 2)}) / this.data.length);
    
    this.heatmap.setDataSet({
      data: this.data,
      max: Math.floor(mean + std * 2),
    });
  };
  
  dataTransformation(apiData) {
    this.data = [];
    
    apiData.forEach((currentPoint) => {
      this.data.push({
        lng: currentPoint.location.x,
        lat: currentPoint.location.y,
        count: currentPoint.count,
      });
    });
    
    return this.data;
  };
  
  mapZoomToRadius(zoomLevel) {
    const mapping = {
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1,
      '5': 1,
      '6': 1,
      '7': 1,
      '8': 1,
      '9': 2,
      '10': 3,
      '11': 4,
      '12': 7,
      '13': 10,
      '14': 12,
      '15': 14,
      '16': 16,
      '17': 18,
      '18': 20,
      '19': 22,
      '20': 24,
    };
    
    return mapping[zoomLevel];
  };
  
  render() {
    return (
      <div>
        <h1>Heatmap 无线支付热力图</h1>
        <strong>请求API状态：<em>{this.state.isFetching ? '正在请求' : '请求成功'}</em></strong>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};