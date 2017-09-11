import React from 'react';

import Util from '../../lib/mavas/util';
import Mavas from '../../lib/mavas/main';
import data from '../mockData/markerData';

import startIcon from '../image/start.png';
import endIcon from '../image/end.png';

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
  }
  
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
    
  }
  
  /*
    *show static gps points
  */
  showStaticGpsRoute() {
    let palettePolyline, paletteMarker, paletteTooltip, paletteInfoWindow;
    
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
      id: 'polyline',
      data: [{
        coords: this.transformedData,
      }],
      algo: {
        cacheAlgo: '9 blocks',
        isRealtime: false,
      },
      lineStyle: {
        color: '#0077FF',
        lineWidth: 5,
      },
    });

    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
          });
        }
        return result;
      })(),
      algo: {
        isRealtime: false,
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {coords: Array, size: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; size = [pixel, pixel], desc: [String, String]]
      *@param {Boolean} cumulative [optional]
      *@param {Number} left [optional: left margin, default to 10px]
      *@param {Number} padding [optional: default to 6px]
      *@param {Number} width [optional: width of context, default to 108px]
      *@param {Number} lineHeight [optional: default to 1.6]
      *@param {String} font [optional: default to '12px monospace']
      *@param {String} color [optional: font color, default to 'white']
      *@param {String} backgroundColor [optional: default to 'rgba(0, 0, 0, 0.7)']
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
            width: startImage.width,
            height: startImage.height,
            desc: data[i].gmtTime,
            offsetY: 28,
          });
        }
        return result;
      })(),
    });
    
    paletteInfoWindow = this.mavas.createLayer({
      type: 'infoWindow',
      id: 'infoWindow',
      data: [{
        coords: [120.057926, 30.183576],
        offset: [-80, 20],
        content: '凤起路站',
        style: {
          shape: 'rect',
        },
      }, {
        coords: [120.058511, 30.183206],
        offset: [-80, 20],
        content: '龙翔桥',
        style: {
          shape: 'roundRect',
          borderWidth: 1,
          borderRadius: 5,
        }
      }],
    });

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  }
  
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
      id: 'polyline',
      data: [{
        coords: this.transformedData,
      }],
      algo: {
        cacheAlgo: '9 blocks',
        isRealtime: false,
      },
      lineStyle: {
        color: '#999999',
      },
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
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
            icon: i % 2 === 0 ? startImage : endImage,
            offsetY: startImage.height / 2,
          });
        }
        return result;
      })(),
      algo: {
        isRealtime: false,
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {coords: Array, size: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; size = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
            width: startImage.width,
            height: startImage.height,
            desc: data[i].gmtTime,
            offsetY: 28,
          });
        }
        return result;
      })(),
    });

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  }
  
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
      data: [{
        coords: this.transformedData,
      }],
      algo: {
        cacheAlgo: '9 blocks',
        isRealtime: true,
      },
      lineStyle: {
        color: 'red',
      },
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
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
          });
        }
        return result;
      })(),
      algo: {
        isRealtime: true,
      },
    });

    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {coords: Array, size: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; size = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
            width: startImage.width,
            height: startImage.height,
            desc: data[i].gmtTime,
            offsetY: 28,
          });
        }
        return result;
      })(),
    });

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  }
  
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
      id: 'polyline',
      data: [{
        coords: this.transformedData.slice(0,2),
      }],
      algo: {
        cacheAlgo: '9 blocks',
        isRealtime: true,
      },
      lineStyle: {
        color: 'red',
      },
    });
    
    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {location, icon} data [optional: location is an array of marker locations, icon is array of canvases for marker icons]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = this.mavas.createLayer({
      type: 'marker',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = 2; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
          });
        }
        return result;
      })(),
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {coords: Array, size: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; size = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
            width: startImage.width,
            height: startImage.height,
            desc: data[i].gmtTime,
            offsetY: 28,
          });
        }
        return result;
      })(),
    });
    
    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    /*
      *alernate drawing canvas and calling browser refresh function
    */
    let i = 3, len = this.transformedData.length;
//    let i = 3, len = 4;
    
    var move = () => {
      if (i < len) {
        palettePolyline.updatePalette({
          type: 'polyline',
          id: 'polyline',
          data: [{
            coords: this.transformedData.slice(0,i),
          }],
          algo: {
            cacheAlgo: '9 blocks',
            isRealtime: true,
          },
          lineStyle: {
            color: 'red',
          },
        });

        palettePolyline.draw();

        paletteMarker.updatePalette({
          type: 'marker',
          data: (() => {
            let result = [];

            for(let index = 0; index < i; index++) {
              result.push({
                coords: this.transformedData[index],
              });
            }
            return result;
          })(),
        });

        paletteMarker.draw();

        paletteTooltip.import({
          location: this.transformedData.slice(0,i),
          size: new Array(i).fill({width: startImage.width, height: startImage.height,}),
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
  }
  
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
      id: 'polyline',
      data: [{
        coords: this.transformedData.slice(0,2),
      }],
      algo: {
        cacheAlgo: '9 blocks',
        isRealtime: true,
      },
      lineStyle: {
        color: 'red',
      },
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
      data: (() => {
        let result = [];
        
        for(let i = 0, len = 2; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
          });
        }
        return result;
      })(),
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {coords: Array, size: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; size = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
            width: startImage.width,
            height: startImage.height,
            desc: data[i].gmtTime,
            offsetY: 28,
          });
        }
        return result;
      })(),
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
        palettePolyline.import({
          location: [this.transformedData.slice(0,i)],
        });

        palettePolyline.draw();

        paletteMarker.import({
          location: this.transformedData.slice(0,i),
          icon: [],
        });

        paletteMarker.draw();

        paletteTooltip.import({
          location: this.transformedData.slice(0,i),
          size: new Array(i).fill({width: startImage.width, height: startImage.height,}),
          desc: Util.pluck(data.slice(0,i), 'gmtTime'),
        });

        paletteTooltip.draw();
        
        i ++;
        
        window.requestAnimationFrame(setCenter);
        
      }
    };
    
    var setCenter = () => {
      this.mavas.map.setCenter(new window.AMap.LngLat(this.transformedData[i - 1][0], this.transformedData[i - 1][1]));
      window.requestAnimationFrame(move);
    };
    
    /*
      *this is the official recommanded render method
      *performance: requestAnimationFrame > setInterval
    */
    window.requestAnimationFrame(move);
  }
  
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
      id: 'polyline',
      data: [{
        coords: this.transformedData,
      }],
      algo: {
        cacheAlgo: '9 blocks',
        isRealtime: true,
      },
      lineStyle: {
        color: 'red',
      },
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
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
          });
        }
        return result;
      })(),
      onClick: (e) => {
        let location, result = [];
        
        for(let len = e.marker.length, i = len - 1; i >= 0; i--) {
          location = e.marker[i].location;
          
          result.push(Util.findIndex(this.transformedData, (element) => {
            return element === location;
          }));
        }
        
        alert(`you are clicking on marker number ${result}`);
      },
    });
    
    /*
      *create tooltip
      *@param {String} type [compulsory]
      *@param {coords: Array, size: Array, desc: Array} data [optional: data = [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number; size = [pixel, pixel], desc: [String, String]]
      *@return {Palette} palette [Palette instance]
    */
    paletteTooltip = this.mavas.createLayer({
      type: 'tooltip',
      data: (() => {
        let result = [];
        
        for(let i = 0, len = this.transformedData.length; i < len; i++) {
          result.push({
            coords: this.transformedData[i],
            width: startImage.width,
            height: startImage.height,
            desc: data[i].gmtTime,
            offsetY: 28,
          });
        }
        return result;
      })(),
    });

    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
    
    //set correct centre and zoom to cover all data points of a particular palette
    this.mavas.setFit(paletteMarker);
  }
  
  clear() {
    this.mavas.map.destroy();
    this.componentDidMount();
  }
  
  render() {
    return (
      <div>
        <h1>Marker Demo</h1>
        <div style={{'height': '50px'}}>
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
  }
}