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
      *@param {Array} data [optional]
      *@color {String} type [optional]
      *@return {Palette} palette [Palette instance]
    */
    palettePolyline = mavas.createLayer({
      type: 'polyline',
      cacheAlgo: '9 blocks',
      data: transformedData,
      color: 'red',
    });
    
    /*
      *create marker
      *@param {String} type [compulsory]
      *@param {Array} data [optional]
      *@return {Palette} palette [Palette instance]
    */
    paletteMarker = mavas.createLayer({
      type: 'marker',
      data: transformedData,
    });
    
//    paletteTooltip = mavas.createLayer({
//      type: 'tooltip',
//      data: tooltip: [Util.pluck(data, 'gmtTime')],
//    });
    
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