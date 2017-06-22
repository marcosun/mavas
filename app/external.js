import React from 'react';
import echarts from 'echarts';

import Util from '../lib/mavas/util';
import Mavas from '../lib/mavas/main';
import data from '../lib/mavas/busRouteData';

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
    
    //create canvas element
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
    
//    document.getElementsByClassName('amap-maps')[0].append(canvas);
    
    /*
      *create external layer
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {Canvas} image [DOM canvas image]
      *@param {String} position [optional: top, topright, default to topright]
      *@return {Palette} palette [Palette instance]
    */
    externalPalette = this.mavas.createLayer({
      type: 'fixedScreenExternal',
      id: 'fixed-screen-guage',
      image: canvas,
      position: 'center',
    });
    
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
    *show static gps points
  */
  showFixedLngLatGuage() {
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
      *@param {[lng, lat]} center [lng: Number, lat: Number]
      *@return {Palette} palette [Palette instance]
    */
    externalPalette = this.mavas.createLayer({
      type: 'external',
      id: 'fixed-guage',
      image: canvas,
      center: [116.483467, 39.987400],
    });
    
    setInterval(function () {
      option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
      myChart.setOption(option, true);

      //use drawImage api to update canvas
      externalPalette.drawImage(canvas);
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
          <a className="btn" onClick={this.showFixedLngLatGuage.bind(this)} href="javascript:;">FixedLngLatGuage</a>
          <a className="btn" onClick={this.clear.bind(this)} href="javascript:;">clear</a>
        </div>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};