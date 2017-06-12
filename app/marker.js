import React from 'react';

import Mavas from '../lib/mavas/main';

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
    let mavas, transformedData, palette,
        data = '116.480904,39.989216;116.480957,39.989189;116.481247,39.988995;116.481407,39.988888;116.481453,39.988869;116.482574,39.988125;116.483414,39.987583;116.483467,39.987404';
    
    //prepare data to this format: [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number
    transformedData = [data.split(';').map((pointStr) => {
      let point, result = [];
      
      point = pointStr.split(',');
      
      result.push(Number(point[0]));
      result.push(Number(point[1]));
      
      return result;
    })];
    
    //init mavas; see amap api reference
    mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 16,
      center: [116.483467,39.987400]
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
    palette = mavas.createLayer({
      type: 'marker',
      cacheAlgo: '9 blocks',
      data: transformedData,
    });
    
    mavas.draw();
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