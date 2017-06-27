import React from 'react';

import Mavas from '../lib/mavas/main';

export default class Heatmap extends React.Component {
  
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
      animateEnable: true,
    });
    
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.Heatmap'], () => {});
    
    //TODO: STRONGLY recommand superagent in production
    var request = new XMLHttpRequest();
    request.open('POST', 'http://10.85.1.171:8080/getByStation', true);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    request.send('startDate=2017-6-2&endDate=2017-6-22');
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200){
        this.setState({
          isFetching: false,
        });
        this.dataTransformation(JSON.parse(request.response))
        this.draw();
      };
    };
  };
  
  draw() {
    let heatmap = new AMap.Heatmap(this.mavas.map, {
      radius: 15, //给定半径
      opacity: [0, 0.8],
    });
    heatmap.setDataSet({
      data: this.data,
      max: 1200,
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