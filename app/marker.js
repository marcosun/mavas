import React from 'react';

import Util from '../lib/mavas/util';
import Mavas from '../lib/mavas/main';
import data from '../lib/mavas/markerData';

import Styles from './marker.css';

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
    let mavas, transformedData, paletteMarker, palettePolyline;
    
    //prepare data to this format: [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number
    transformedData = [data.map((pointObj) => {
      let result = [];
      
      result.push(pointObj.lng);
      result.push(pointObj.lat);
      
      return result;
    })];
    
    //init mavas; see amap api reference
    mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 16,
      center: [120.057926,30.183576]
    });
    //init amap layers on demand; see amap api reference
    mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {String} cacheAlgo [optional]
      *@param {{interval: Number,String, size: Number,String }} delay [optional]
      *@param {Array} data [optional]
      *@color {String} type [optional]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = mavas.createLayer({
      type: 'marker',
      data: transformedData,
      tooltip: [Util.pluck(data, 'gmtTime')],
    });
    
    palettePolyline = mavas.createLayer({
      type: 'polyline',
      cacheAlgo: '9 blocks',
      delay: {
        interval: 100,
        size: 100,
      },
      data: transformedData,
      color: 'red',
    });
    
    mavas.draw({
      zIndex: 100,
    });
  };
  
  render() {
    return (
      <div>
        <h1>This is Marker page</h1>
        <div className={Styles.mapContainer} id="map"></div>
      </div>
    );
  };
};