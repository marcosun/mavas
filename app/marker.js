import React from 'react';

import Util from '../lib/mavas/util';
import Mavas from '../lib/mavas/main';
import data from './mockData/markerData';

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class Marker extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
  };
  
  componentDidMount() {
    //prepare data to this format: [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number
    this.transformedData = data.map((pointObj) => {
      let result = [];
      
      result.push(pointObj.lng);
      result.push(pointObj.lat);
      
      return result;
    });
    
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 16,
      center: [120.057926,30.183576],
      animateEnable: false,
    });
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
  };
  
  /*
    *show static gps points
  */
  showStaticGpsRoute() {
    let palette, palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: [this.transformedData],
      cacheAlgo: '9 blocks',
      color: 'red',
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@param {Array} tooltip [optional]
      *@return {Palette} palette [Palette instance]
    */
    palette = this.mavas.createLayer({
      type: 'marker',
      data: this.transformedData,
      tooltip: Util.pluck(data, 'gmtTime'),
    });

    paletteMarker = palette.palette;
    paletteTooltip = palette.paletteTooltip;

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  };
  
  showRealtimeStaticGpsRoute() {
    let palette, palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {Boolean} realtime [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: [this.transformedData],
      cacheAlgo: '9 blocks',
      realtime: true,
      color: 'red',
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {Array} data [optional]
      *@param {Array} tooltip [optional]
      *@param {Boolean} realtime [optional]
      *@return {Palette} palette [Palette instance]
    */
    palette = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: this.transformedData,
      tooltip: Util.pluck(data, 'gmtTime'),
      realtime: true,
    });

    paletteMarker = palette.palette;
    paletteTooltip = palette.paletteTooltip;

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  };
  
  /*
    *show dynamic || real-time gps points
  */
  showDynamicGpsRoute() {
    let palette, palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: [this.transformedData.slice(0,2)],
      cacheAlgo: '9 blocks',
      color: 'red',
    });
    
    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@param {Array} tooltip [optional]
      *@return {Palette} palette [Palette instance]
    */
    palette = this.mavas.createLayer({
      type: 'marker',
      data: this.transformedData.slice(0,2),
      tooltip: Util.pluck(data.slice(0,2), 'gmtTime'),
    });
    
    paletteMarker = palette.palette;
    paletteTooltip = palette.paletteTooltip;
    
    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    /*
      *alernate drawing canvas and calling browser refresh function
    */
    var i = 3, len = this.transformedData.length;
    
    var move = () => {
      if (i < len) {
        palettePolyline.importData([this.transformedData.slice(0,i)]);

        palettePolyline.draw();

        paletteMarker.importData(this.transformedData.slice(0,i));

        paletteMarker.draw();

        paletteTooltip.importData({marker: this.transformedData.slice(0,i), tooltip: Util.pluck(data.slice(0,i), 'gmtTime')});

        paletteTooltip.draw();
        
        i ++;
        
        window.requestAnimationFrame(move);
        
      }
    };
    
    /*
      *this is the official recommanded render method
      *performance: requestAnimationFrame > setInterval
    */
    window.requestAnimationFrame(move);
  };
  
  /*
    *show dynamic || real-time FOCUS on new gps points
  */
  showDynamicFocusNewGpsRoute() {
    let palette, palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: [this.transformedData.slice(0,2)],
      cacheAlgo: '9 blocks',
      color: 'red',
    });
    
    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@param {Array} tooltip [optional]
      *@return {Palette} palette [Palette instance]
    */
    palette = this.mavas.createLayer({
      type: 'marker',
      data: this.transformedData.slice(0,2),
      tooltip: Util.pluck(data.slice(0,2), 'gmtTime'),
    });
    
    paletteMarker = palette.palette;
    paletteTooltip = palette.paletteTooltip;
    
    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    /*
      *alernate drawing canvas and calling browser refresh function
    */
    var i = 3, len = this.transformedData.length;
    
    var move = () => {
      if (i < len) {
        palettePolyline.importData([this.transformedData.slice(0,i)]);

        palettePolyline.draw();

        paletteMarker.importData(this.transformedData.slice(0,i));

        paletteMarker.draw();

        paletteTooltip.importData({marker: this.transformedData.slice(0,i), tooltip: Util.pluck(data.slice(0,i), 'gmtTime')});

        paletteTooltip.draw();
        
        i ++;
        
        window.requestAnimationFrame(setCenter);
        
      }
    };
    
    var setCenter = () => {
      this.mavas.map.setCenter(new AMap.LngLat(this.transformedData[i - 1][0], this.transformedData[i - 1][1]));
      window.requestAnimationFrame(move);
    };
    
    /*
      *this is the official recommanded render method
      *performance: requestAnimationFrame > setInterval
    */
    window.requestAnimationFrame(move);
  };
  
  clear() {
    this.mavas.map.destroy();
    this.componentDidMount();
  };
  
  render() {
    return (
      <div>
        <h1>Marker Demo</h1>
        <div style={{"height": "50px"}}>
          <a className="btn" onClick={this.showStaticGpsRoute.bind(this)} href="javascript:;">静态gps轨迹</a>
          <a className="btn" onClick={this.showRealtimeStaticGpsRoute.bind(this)} href="javascript:;">静态实时重绘gps轨迹</a>
          <a className="btn" onClick={this.showDynamicGpsRoute.bind(this)} href="javascript:;">动态gps轨迹</a>
          <a className="btn" onClick={this.showDynamicFocusNewGpsRoute.bind(this)} href="javascript:;">动态跟踪gps轨迹</a>
          <a className="btn" onClick={this.clear.bind(this)} href="javascript:;">clear</a>
        </div>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};