import React from 'react';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';
import data from '../lib/mavas/busRouteData';

import Styles from './map.css';

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class Map extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
  };
  
  componentDidMount() {
    let mavas, transformedData, palette;
    
    //prepare data to this format: [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number
    transformedData = data.map((route) => {
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
      type: 'polyline',
      cacheAlgo: '9 blocks',
      delay: {
        interval: 100,
        size: 100,
      },
      data: transformedData,
      color: 'green',
    });
    
    mavas.draw();
  };
  
  render() {
    return (
      <div className={Styles.mapContainer} id="map"></div>
    );
  };
};



/*
  *polylines
'116.481003,39.989311;116.480957,39.989265;116.480904,39.989220';
'116.480904,39.989216;116.480957,39.989189;116.481247,39.988995;116.481407,39.988888;116.481453,39.988869;116.482574,39.988125;116.483414,39.987583;116.483467,39.987404';

'116.483467,39.987400;116.483414,39.987358;116.482811,39.986820;116.482025,39.986088;116.481346,39.985489;116.481293,39.985435;116.481148,39.985275';


'116.481148,39.985268;116.481247,39.985203;116.481270,39.985096;116.482162,39.984493;116.482498,39.984257';

'116.482498,39.984253;116.482460,39.984219;116.482170,39.983971;116.481911,39.983723';
*/