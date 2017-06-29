import React from 'react';

import Util from '../lib/mavas/util';
import Mavas from '../lib/mavas/main';
import data from './mockData/markerData';

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
    let palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {location: Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: {
        location: [this.transformedData],
      },
      cacheAlgo: '9 blocks',
      color: 'red',
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      data: {
        location: this.transformedData,
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {location: Array, markerSize: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; markerSize = [pixel, pixel], desc: [String, String]]
      *@param {Boolean} cumulative [optional]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: {
        location: this.transformedData,
        markerSize: new Array(this.transformedData.length).fill({width: startImage.width, height: startImage.height,}),
        desc: Util.pluck(data, 'gmtTime'),
      },
      cumulative: true,
    });

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  };
  
  showStaticGpsRouteWithCustomisedIcon() {
    let palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {location: Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: {
        location: [this.transformedData],
      },
      cacheAlgo: '9 blocks',
      color: 'red',
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@param {Array} icon [compulsory: Array of canvases for marker icons]
      *@param {Array} tooltip [optional]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      data: {
        location: this.transformedData,
        icon: (() => {
          let result = [];
          
          for(let i = 0, len = this.transformedData.length; i < len; i = i + 2) {
            result.push(startImage);
            result.push(endImage);
          }
          
          return result;
        })(),
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {location: Array, markerSize: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; markerSize = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: {
        location: this.transformedData,
        markerSize: new Array(this.transformedData.length).fill({width: startImage.width, height: startImage.height,}),
        desc: Util.pluck(data, 'gmtTime'),
      },
    });

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  };
  
  showRealtimeStaticGpsRoute() {
    let palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {location: Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {Boolean} realtime [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: {
        location: [this.transformedData],
      },
      cacheAlgo: '9 blocks',
      realtime: true,
      color: 'red',
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@param {Boolean} realtime [optional]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: {
        location: this.transformedData,
      },
      realtime: true,
    });

    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {location: Array, markerSize: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; markerSize = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: {
        location: this.transformedData,
        markerSize: new Array(this.transformedData.length).fill({width: startImage.width, height: startImage.height,}),
        desc: Util.pluck(data, 'gmtTime'),
      },
    });

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
    let palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {location: Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: {
        location: [this.transformedData.slice(0,2)],
      },
      cacheAlgo: '9 blocks',
      color: 'red',
    });
    
    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      data: {
        location: this.transformedData.slice(0,2),
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {location: Array, markerSize: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; markerSize = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: {
        location: this.transformedData,
        markerSize: new Array(this.transformedData.length).fill({width: startImage.width, height: startImage.height,}),
        desc: Util.pluck(data, 'gmtTime'),
      },
    });
    
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
        palettePolyline.importData({
          location: [this.transformedData.slice(0,i)],
        });

        palettePolyline.draw();

        paletteMarker.importData({
          location: this.transformedData.slice(0,i),
          icon: [],
        });

        paletteMarker.draw();

        paletteTooltip.importData({
          location: this.transformedData.slice(0,i),
          markerSize: new Array(i).fill({width: startImage.width, height: startImage.height,}),
          desc: Util.pluck(data.slice(0,i), 'gmtTime'),
        });

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
    let palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {location: Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: {
        location: [this.transformedData.slice(0,2)],
      },
      cacheAlgo: '9 blocks',
      color: 'red',
    });
    
    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@param {Array} tooltip [optional]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      data: {
        location: this.transformedData.slice(0,2),
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {location: Array, markerSize: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; markerSize = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: {
        location: this.transformedData,
        markerSize: new Array(this.transformedData.length).fill({width: startImage.width, height: startImage.height,}),
        desc: Util.pluck(data, 'gmtTime'),
      },
    });
    
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
        palettePolyline.importData({
          location: [this.transformedData.slice(0,i)],
        });

        palettePolyline.draw();

        paletteMarker.importData({
          location: this.transformedData.slice(0,i),
          icon: [],
        });

        paletteMarker.draw();

        paletteTooltip.importData({
          location: this.transformedData.slice(0,i),
          markerSize: new Array(i).fill({width: startImage.width, height: startImage.height,}),
          desc: Util.pluck(data.slice(0,i), 'gmtTime'),
        });

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
  
  showMarkerOnClick() {
    let palettePolyline, paletteMarker, paletteTooltip;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {location: Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = this.mavas.createLayer({
      type: 'polyline',
      data: {
        location: [this.transformedData],
      },
      cacheAlgo: '9 blocks',
      color: 'red',
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@param {Function} onClick [optional: click callback]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      data: {
        location: this.transformedData,
      },
      onClick: (e) => {
        let location, result = [];
        
        for(let len = e.marker.length, i = len - 1; i >= 0; i--) {
          location = e.marker[i].location;
          
          result.push(Util.findIndex(this.transformedData, (element, index) => {
            return element === location;
          }));
        };
        
        alert(`you are clicking on marker number ${result}`);
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {location: Array, markerSize: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; markerSize = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: {
        location: this.transformedData,
        markerSize: new Array(this.transformedData.length).fill({width: startImage.width, height: startImage.height,}),
        desc: Util.pluck(data, 'gmtTime'),
      },
    });

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
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
          <a className="btn" onClick={this.showStaticGpsRouteWithCustomisedIcon.bind(this)} href="javascript:;">自定义气泡静态gps轨迹</a>
          <a className="btn" onClick={this.showRealtimeStaticGpsRoute.bind(this)} href="javascript:;">静态实时重绘gps轨迹</a>
          <a className="btn" onClick={this.showDynamicGpsRoute.bind(this)} href="javascript:;">动态gps轨迹</a>
          <a className="btn" onClick={this.showDynamicFocusNewGpsRoute.bind(this)} href="javascript:;">动态跟踪gps轨迹</a>
          <a className="btn" onClick={this.showMarkerOnClick.bind(this)} href="javascript:;">点击气泡事件</a>
          <a className="btn" onClick={this.clear.bind(this)} href="javascript:;">clear</a>
        </div>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};