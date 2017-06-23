import React from 'react';
import echarts from 'echarts';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class Heatmap extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
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
    this.mavas.map.plugin(['AMap.Heatmap'], () => {});
    
    var request = new XMLHttpRequest();
    request.open('POST', 'http://10.88.1.227:8080/getByStation', true);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    request.send('startDate=2017-6-2&endDate=2017-6-22');
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200){
        this.mockData = JSON.parse(request.response);
        this.draw();
      };
    };
  };
  
  draw() {
    let palette, polylinePalette, markerPalette, tooltipPalette;
    
    this.dataTransformation();
    
    let heatmap = new AMap.Heatmap(this.mavas.map, {
      radius: 15, //给定半径
      opacity: [0, 0.8],
    });
    heatmap.setDataSet({
      data: this.data,
      max: 1200,
    });
  };
  
  dataTransformation() {
    this.data = [];
    
    this.mockData.forEach((currentPoint) => {
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
        <h1>Heatmap</h1>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};