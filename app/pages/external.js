import React from 'react';
import echarts from 'echarts';

import Util from '../../lib/mavas/util';
import Mavas from '../../lib/mavas/main';
import data from '../mockData/busRouteData';

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class External extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
  };
  
  componentDidMount() {
    //prepare data to this format: [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number
    this.transformedData = data.map((route) => {
      let len = route.length,
          prev = [0,0],
          result = [];
      
      for (let i = 0; i < len; i += 2) {
        prev[0] = Util.toDecimal(prev[0] + route[i] / 10000, 4);
        prev[1] = Util.toDecimal(prev[1] + route[i + 1] / 10000, 4);
        result.push([prev[0], prev[1]]);
      }
      
      return result;
    });
    
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 16,
      center: [116.483467,39.987400],
      mapStyle: 'amap://styles/darkblue',
    });
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
  };
  
  /*
    *show fixed external image on somewhere on the screen
  */
  showFixedScreenGuage() {
    let palette, canvas, myChart,  option, externalPalette;
    
    palette = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: this.transformedData,
      cacheAlgo: '9 blocks',
      realtime: true,
      color: 'red',
    });
    
    //create canvas element for echarts
    canvas = document.createElement('canvas');
    canvas.id = 'fixed-screen-guage';
    canvas.width = 300;
    canvas.height = 300;
    
    //draw canvas with 3rd party plugins such as Echarts by Baidu
    myChart = echarts.init(canvas);
    option = {
      tooltip : {
        formatter: "{a} <br/>{b} : {c}%",
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {},
        },
      },
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          detail: {formatter:'{value}%'},
          data: [{value: 50, name: '完成率'}],
        },
      ],
    };

    option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
    myChart.setOption(option, true);
    
    /*
      *create external layer
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {Canvas} image [DOM canvas image]
      *@param {String or Array} position [optional: keywords such as top, or an Array indicating the postion of top left corner such as [0, 0] === 'topleft', default to topright]
      *@return {Palette} palette [Palette instance]
    */
    externalPalette = this.mavas.createLayer({
      type: 'fixedScreenExternal',
      id: 'fixed-screen-guage',
      image: canvas,
      position: 'topleft',//[10, 10]
    });
    
    //update guage
    setInterval(function () {
      option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
      myChart.setOption(option, true);
    },2000);

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
  };
  
  clear() {
    this.mavas.map.destroy();
    this.componentDidMount();
  };
  
  
  /*
    *show fixed location gps points
  */
  showFixedLocationGuage() {
    let palette, canvas, myChart, option, externalPalette;
    
    palette = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: this.transformedData,
      cacheAlgo: '9 blocks',
      realtime: true,
      color: 'red',
    });
    
    //create canvas element
    canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    
    //draw canvas with 3rd party plugins such as Echarts by Baidu
    myChart = echarts.init(canvas);
    option = {
      tooltip : {
        formatter: "{a} <br/>{b} : {c}%",
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {},
        },
      },
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          detail: {formatter:'{value}%'},
          data: [{value: 50, name: '完成率'}],
        },
      ],
      animation: false,
    };

    option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
    myChart.setOption(option, true);
    
    /*
      *create external layer
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {Canvas} image [DOM canvas image]
      *@param {[lng, lat]} position [lng: Number, lat: Number]
      *@return {Palette} palette [Palette instance]
    */
    externalPalette = this.mavas.createLayer({
      type: 'fixedLocationExternal',
      id: 'fixed-location-guage',
      image: canvas,
      position: [116.483467, 39.987400],
    });
    
    setInterval(function () {
      option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
      myChart.setOption(option, true);

      //use update api to update canvas
      externalPalette.update(canvas);
    },2000);

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
  };
  
  render() {
    return (
      <div>
        <h1>Intergrating with External Images Demo</h1>
        <div style={{"height": "50px"}}>
          <a className="btn" onClick={this.showFixedScreenGuage.bind(this)} href="javascript:;">FixedScreenGuage</a>
          <a className="btn" onClick={this.showFixedLocationGuage.bind(this)} href="javascript:;">FixedLocationGuage</a>
          <a className="btn" onClick={this.clear.bind(this)} href="javascript:;">clear</a>
        </div>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};