import React from 'react';

import Util from '../lib/mavas/util';
import Mavas from '../lib/mavas/main';
import data from '../lib/mavas/markerData';

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
      center: [120.057926,30.183576]
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
      *@param {String} cacheAlgo [optional]
      *@param {Array} data [optional]
      *@color {String} type [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      cacheAlgo: '9 blocks',
      data: [this.transformedData],
      color: 'red',
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@param {Array} tooltip [optional]
      *@param {Boolean} fit [optional: default false]
      *@return {Palette} palette [Palette instance]
    */
    palette = this.mavas.createLayer({
      type: 'marker',
      data: this.transformedData,
      tooltip: Util.pluck(data, 'gmtTime'),
      fit: true,
    });

    paletteMarker = palette.palette;
    paletteTooltip = palette.paletteTooltip;

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
  };
  
  /*
    *show dynamic || real-time gps points
  */
  showRealTimeGpsRoute() {
    let palette, palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {String} cacheAlgo [optional]
      *@param {Array} data [optional]
      *@color {String} type [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      cacheAlgo: '9 blocks',
      data: [this.transformedData.slice(0,2)],
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
      *draw every point at a seperate js loop cycle
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
          <a className="btn" onClick={this.showRealTimeGpsRoute.bind(this)} href="javascript:;">动态gps轨迹</a>
          <a className="btn" onClick={this.clear.bind(this)} href="javascript:;">clear</a>
        </div>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};