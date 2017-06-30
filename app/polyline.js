import React from 'react';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';
import data from './mockData/busRouteData';

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class Polyline extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.defaultState = {
      algo: {
        '9 blocks': false,
        'simple': false,
      },
      render: {
        'instant': false,
        'delay': false,
        'realtime': false,
      },
    };
    this.state = {
      algo: {
        ...this.defaultState.algo,
        '9 blocks': true,
      },
      render: {
        ...this.defaultState.render,
        'instant': true,
      },
    };
  };
  
  componentDidMount() {
    //prepare data to this format: [line, line], line = [point, point], point = [lng, lat], where lng and lat are float number
    this.transformedData = data.map((route) => {
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
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 12,
      center: [116.483467,39.987400],
      mapStyle: 'amap://styles/darkblue',
    });
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
  };
  
  onChange(e) {
    switch(e.target.name) {
      case '9 blocks':
        this.setState({
          ...this.state,
          algo: {
            ...this.defaultState.algo,
            '9 blocks': true,
          },
        });
        break;
      case 'simple':
        this.setState({
          ...this.state,
          algo: {
            ...this.defaultState.algo,
            'simple': true,
          },
        });
        break;
      case 'instant':
        this.setState({
          ...this.state,
          render: {
            ...this.defaultState.render,
            'instant': true,
          },
        });
        break;
      case 'delay':
        this.setState({
          ...this.state,
          render: {
            ...this.defaultState.render,
            'delay': true,
          },
        });
        break;
      case 'realtime':
        this.setState({
          ...this.state,
          render: {
            ...this.defaultState.render,
            'realtime': true,
          },
        });
        break;
      default:
        throw new Error('unknown error');
    };
  };
  
  draw() {
    let palette;
    
    /*
      *create polyline
      *@param {String} type [compulsory]
      *@param {String} id [optional]
      *@param {location: Array} data [optional]
      *@param {String} cacheAlgo [optional]
      *@param {{interval: Number,String, size: Number,String }} delay [optional]
      *@param {Boolean} realtime [optional]
      *@param {String} color [optional]
      *@return {Palette} palette [Palette instance]
    */
    palette = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: {
        location: this.transformedData,
      },
      cacheAlgo: this.state.algo['9 blocks'] ? '9 blocks' : 'simple',
      delay: this.state.render.instant ? undefined : {
        interval: 100,
        size: 100,
      },
      realtime: this.state.render.realtime,
      color: '#00FFFF',
    });
    
    this.mavas.draw();
  };
  
  clear() {
    this.mavas.map.destroy();
    this.componentDidMount();
  };
  
  render() {
    return (
      <div>
        <h1 style={{'margin': '10px 0'}}>Polyline Demo</h1>
        <div style={{'height': '50px'}}>
          <div style={{'display': 'inline-block'}}>
            <h5 style={{'margin': '5px 0'}}>算法（必选、单选）</h5>
            <label style={{"padding": "2px 5px"}}><input name="9 blocks" onChange={this.onChange.bind(this)} type="checkbox" checked={this.state.algo['9 blocks']}></input>9 blocks</label>
            <label style={{"padding": "2px 5px"}}><input name="simple" onChange={this.onChange.bind(this)} type="checkbox" checked={this.state.algo.simple}></input>simple</label>
          </div>
          <div style={{'display': 'inline-block', 'marginLeft': '100px'}}>
            <h5 style={{'margin': '5px 0'}}>渲染方式（必选、单选）</h5>
            <label style={{"padding": "2px 5px"}}><input name="instant" onChange={this.onChange.bind(this)} type="checkbox" checked={this.state.render.instant}></input>instant</label>
            <label style={{"padding": "2px 5px"}}><input name="delay" onChange={this.onChange.bind(this)} type="checkbox" checked={this.state.render.delay}></input>delay</label>
            <label style={{"padding": "2px 5px"}}><input name="realtime" onChange={this.onChange.bind(this)} type="checkbox" checked={this.state.render.realtime}></input>realtime</label>
          </div>
          <a className="btn" onClick={this.clear.bind(this)} href="javascript:;">clear</a>
          <a className="btn" onClick={this.draw.bind(this)} href="javascript:;">draw</a>
        </div>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};