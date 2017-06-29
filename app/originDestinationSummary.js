import React from 'react';
import echarts from 'echarts';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

import startIcon from './image/start.png';
import endIcon from './image/end.png';

let startImage = document.createElement('img'),
    endImage = document.createElement('img');

startImage.src = startIcon;
endImage.src = endIcon;

let isRelationalVision = false;

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
    request.open('GET', 'http://10.85.1.171:8080/od', true);
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
      data: {
        location: this.data,
      },
      realtime: true,
      color: 'red',
    });
    
    palette = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: {
        location: (() => {
          let result = [];
          
          this.data.forEach((currentLine) => {
            result.push(currentLine[0]);
            result.push(currentLine[1]);
          });

          return result;
        })(),
        icon: (() => {
          let result = [];
          
          for(let i = 0, len = this.data.length; i < len; i++) {
            result.push(startImage);
            result.push(endImage);
          }
          
          return result;
        })(),
      },
      realtime: true,
      onClick: (e) => {
        
        if (isRelationalVision === true) {
          
          polylinePalette.importData({
            location: this.data,
          });

          polylinePalette.draw(true);

          markerPalette.importData({
            location: (() => {
              let result = [];

              this.data.forEach((currentLine) => {
                result.push(currentLine[0]);
                result.push(currentLine[1]);
              });

              return result;
            })(),
            icon: (() => {
              let result = [];

              for(let i = 0, len = this.data.length; i < len; i++) {
                result.push(startImage);
                result.push(endImage);
              }

              return result;
            })(),
          });

          markerPalette.draw(true);
          
          isRelationalVision = false;
          
        } else {
          let location, result = [], lines;

          for(let len = e.marker.length, i = len - 1; i >= 0; i--) {
            location = e.marker[i].location;

            //push index of founded line into the result
            result.push(Util.findIndex(this.data, (element, index) => {
              //check both starting and ending points
              return element.find((e) => {
                return e[0] === location[0] && e[1] === location[1];
              }) !== undefined ? true : false;
            }));
          };

          lines = Util.unique(Util.flatten(result));
          
          (() => {
            let result = [];
            
            for(let i = 0, len = lines.length; i < len; i++) {
              result.push(this.data[lines[i]]);
            }
            
            this.newData = result;
          })();
          
          polylinePalette.importData({
            location: this.newData,
          });

          polylinePalette.draw(true);

          markerPalette.importData({
            location: (() => {
              let result = [];

              this.newData.forEach((currentLine) => {
                result.push(currentLine[0]);
                result.push(currentLine[1]);
              });

              return result;
            })(),
            icon: (() => {
              let result = [];

              for(let i = 0, len = this.newData.length; i < len; i++) {
                result.push(startImage);
                result.push(endImage);
              }

              return result;
            })(),
          });

          markerPalette.draw(true);

//          tooltipPalette.importData({
//            marker: (() => {
//              let result = [];
//
//              this.newData.forEach((currentLine) => {
//                result.push(currentLine[0]);
//                result.push(currentLine[1]);
//              });
//
//              return result;
//            })(),
//            tooltip: Util.pluck(data.slice(0,i), 'gmtTime'),
//          });
//
//          tooltipPalette.draw();
          
          isRelationalVision = true;
        }
      },
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