import React from 'react';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';
//const data = [{"startStation":"丁桥公交站","endStation":"城站火车站","firstMiddleStation":null,"secondMiddleStation":null,"startLocation":{"x":120.2388,"y":30.354945,"type":"Point","coordinates":[120.2388,30.354945]},"endLocation":{"x":120.183522,"y":30.245954,"type":"Point","coordinates":[120.183522,30.245954]},"firstMiddleLocation":null,"secondMiddleLocation":null,"num":4},{"startStation":"五常公交站","endStation":"玉古路天目山路口","firstMiddleStation":null,"secondMiddleStation":null,"startLocation":{"x":120.044934,"y":30.277273,"type":"Point","coordinates":[120.044934,30.277273]},"endLocation":{"x":120.129484,"y":30.269454,"type":"Point","coordinates":[120.129484,30.269454]},"firstMiddleLocation":null,"secondMiddleLocation":null,"num":3},{"startStation":"文三西路西","endStation":"浣纱路国货路口","firstMiddleStation":null,"secondMiddleStation":null,"startLocation":{"x":120.091262,"y":30.275145,"type":"Point","coordinates":[120.091262,30.275145]},"endLocation":{"x":120.16632,"y":30.24948,"type":"Point","coordinates":[120.16632,30.24948]},"firstMiddleLocation":null,"secondMiddleLocation":null,"num":5},{"startStation":"河渚桥","endStation":"古荡东","firstMiddleStation":null,"secondMiddleStation":null,"startLocation":{"x":120.079805,"y":30.283949,"type":"Point","coordinates":[120.079805,30.283949]},"endLocation":{"x":120.125794,"y":30.272087,"type":"Point","coordinates":[120.125794,30.272087]},"firstMiddleLocation":null,"secondMiddleLocation":null,"num":1},{"startStation":"古荡","endStation":"草鞋桥","firstMiddleStation":null,"secondMiddleStation":null,"startLocation":{"x":120.12318,"y":30.272049,"type":"Point","coordinates":[120.12318,30.272049]},"endLocation":{"x":120.05783,"y":30.332554,"type":"Point","coordinates":[120.05783,30.332554]},"firstMiddleLocation":null,"secondMiddleLocation":null,"num":1},{"startStation":"缤纷小区","endStation":"杭州解百","firstMiddleStation":null,"secondMiddleStation":null,"startLocation":{"x":120.225105,"y":30.215364,"type":"Point","coordinates":[120.225105,30.215364]},"endLocation":{"x":120.16519,"y":30.250187,"type":"Point","coordinates":[120.16519,30.250187]},"firstMiddleLocation":null,"secondMiddleLocation":null,"num":1}];

const data = [{"startStation":"丁桥公交站","endStation":"城站火车站","firstMiddleStation":null,"secondMiddleStation":null,"startLocation":{"x":120.2388,"y":30.354945,"type":"Point","coordinates":[120.2388,30.354945]},"endLocation":{"x":120.183522,"y":30.245954,"type":"Point","coordinates":[120.183522,30.245954]},"firstMiddleLocation":null,"secondMiddleLocation":null,"num":4}];

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class Curve extends React.Component {
  
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
    this.transformedData = [];
    
    data.forEach((currentRoute) => {
      this.transformedData.push([[currentRoute.startLocation.x, currentRoute.startLocation.y], [currentRoute.endLocation.x, currentRoute.endLocation.y]]);
    });
    
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 12,
      center: [120.2388,30.354945],
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
      *create curve
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
      type: 'curve',
      id: 'curve',
      data: {
        location: this.transformedData,
      },
      cacheAlgo: this.state.algo['9 blocks'] ? '9 blocks' : 'simple',
      delay: this.state.render.instant ? undefined : {
        interval: 100,
        size: 100,
      },
      realtime: this.state.render.realtime,
      color: 'red',
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
        <h1 style={{'margin': '10px 0'}}>Curve Demo</h1>
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