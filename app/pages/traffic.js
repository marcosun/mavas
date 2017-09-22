import React from 'react';
import request from 'superagent';

import Mavas from '../../lib/mavas/main';
import Util from '../../lib/mavas/util';

export default class Traffic extends React.Component {
  constructor() {
    super();
    
    this.polylineVm = {
      type: 'polyline',
      id: 'polyline',
    };
    
    this.searchConditions = {
      northwestLng: undefined,
      northwestLat: undefined,
      southeastLng: undefined,
      southeastLat: undefined,
    };
  }
  
  componentDidMount() {
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 11,
      center: [120.16405,30.254651],
      animateEnable: false,
    });
    
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
    this.polylinePalette = this.mavas.createLayer(this.polylineVm);
    
    this.mavas.draw({
      zIndex: 150,
    });
    
    this.bindMove();
    this.update();
  }
  
  update() {
    const bounds = this.mavas.map.getBounds();

    this.updateSearchConditions({ //update search conditions
      northwestLng: bounds.southwest.lng,
      northwestLat: bounds.northeast.lat,
      southeastLng: bounds.northeast.lng,
      southeastLat: bounds.southwest.lat,
    });
    
    this.fetch()
    .then((res) => {this.reducer(res.body.items)})
    .then(() => {this.draw()})
    .catch((e) => {
      throw Error(e);
    });
  }
  
  draw() {
    this.polylinePalette.updatePalette(this.polylineVm);
    this.polylinePalette.draw(true);
  }
  
  fetch() {
    return request('GET', 'http://10.88.2.175:8083/v1/opstat/getLinkSpeedByRectangle')
    .query(this.searchConditions);
  }
  
  reducer(data) {
    this.polylineVm.data = []; //reset polyline data
    
    for (let i = 0, len = data.length; i < len; i++) { //push each line into polyline palette model
      const road = data[i];
      const coords = road.geometry.coordinates;
      const lineStyle = {
        lineWidth: 3,
        color: (() => {
          if (road.properties.speed < 3.6) return 'red';
          if (road.properties.speed < 4) return 'orange';
          return 'green';
        })(),
      };
      
      this.polylineVm.data.push({
        coords,
        lineStyle,
      });
    }
  }
  
  bindMove() {
    this.mavas.map.on('moveend', () => {
      this.update();
    });
  }
  
  updateSearchConditions({northwestLng, northwestLat, southeastLng, southeastLat}) {
    this.searchConditions = {
      northwestLng,
      northwestLat,
      southeastLng,
      southeastLat,
    }
  }
  
  render() {
    return <div className="map-container" id="map" style={{'height': '100vh'}}></div>
  }
}