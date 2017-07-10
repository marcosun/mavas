import React from 'react';

import Util from '../lib/mavas/util';
import Mavas from '../lib/mavas/main';

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class Playground extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      palettes: [],
      options: [],
    };
    this.nextMarkerId = 1;
    this.nextPolylineId = 1;
  };
  
  componentDidMount() {
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 13,
      center: [120.057926,30.183576],
      animateEnable: false,
      mapStyle: 'amap://styles/darkblue',
    });
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
  };
  
  createMarkerOption() {
    return {
      type: 'marker',
      id: this.nextMarkerId++ && `marker${this.nextMarkerId - 1}`,
      globalId: this.nextMarkerId + this.nextPolylineId - 2,
      data: {
        location: [],
        icon: [],
      },
      realtime: true,
    };
  };
  
  createPolylineOption() {
    return {
      type: 'polyline',
      id: this.nextPolylineId++ && `polyline${this.nextPolylineId - 1}`,
      globalId: this.nextMarkerId + this.nextPolylineId - 2,
      data: {
        location: [],
      },
      cacheAlgo: '9 blocks',
      realtime: true,
    };
  };
  
  createPalette(e) {
    const index = e.target.parentElement.getAttribute('data-id') - 1,
      palette = this.mavas.createLayer(this.state.options[index]);
    
    this.setState({
      ...this.state,
      palettes: this.state.palettes.concat(palette),
    });
    
    e.target.disabled = true;
    
    return palette;
  };
  
  onNewMarkerClick() {
    this.setState({
      ...this.state,
      options: this.state.options.concat(this.createMarkerOption()),
    });
  };

  onNewPolylineClick() {
    this.setState({
      ...this.state,
      options: this.state.options.concat(this.createPolylineOption()),
    });
  };
  
  markerTemplate(id, globalId) {
    return (
      <div key={id} data-id={globalId}>
        <label>气泡{id.replace(/marker/, '')} 坐标：</label><input type="text" onChange={this.updateMarkerLocationData.bind(this)}/>
        <label>气泡图案</label><input type="file" onChange={this.updateIcon.bind(this)}/>
        <button onClick={this.createPalette.bind(this)}>确认参数</button>
      </div>
    );
  };
  
  polylineTemplate(id, globalId) {
    return (
      <div key={id} data-id={globalId}>
        <label>线条{id.replace(/polyline/, '')} 坐标：</label><input type="text" onChange={this.updatePolylineLocationData.bind(this)}/>
        <label>线条颜色</label><input type="text" onChange={this.updateColor.bind(this)}/>
        <button onClick={this.createPalette.bind(this)}>确认参数</button>
      </div>
    );
  };
  
  updateMarkerLocationData(e) {
    let index = e.target.parentElement.getAttribute('data-id') - 1;
    
    this.setState({
      ...this.state,
      options: (() => {
        let result = [];
        
        for(let i = 0, len = this.state.options.length; i < len; i++) {
          const location = eval(e.target.value);
          
          if (i === index) {
            result.push(Object.assign(
              {},
              this.state.options[i],
              {
                data: {
                  location: location,
                  icon: (new Array(location.length)).fill(this.state.options[i].image),
                },
              },
            ));
          } else {
            result.push(this.state.options[i]);
          }
        };

        return result;
      })(),
    });
  };

  updatePolylineLocationData(e) {
    let index = e.target.parentElement.getAttribute('data-id') - 1;
    
    this.setState({
      ...this.state,
      options: (() => {
        let result = [];
        
        for(let i = 0, len = this.state.options.length; i < len; i++) {
          const location = eval(e.target.value);
          
          if (i === index) {
            result.push(Object.assign(
              {},
              this.state.options[i],
              {
                data: {
                  location: [location],
                },
              },
            ));
          } else {
            result.push(this.state.options[i]);
          }
        };

        return result;
      })(),
    });
  };

  updateIcon(e) {
    const reader = new FileReader(),
      file = e.target.files[0],
      index = e.target.parentElement.getAttribute('data-id') - 1;
    
    if (file === undefined) return;
    
    if (/^image/.test(file.type)) {
      reader.readAsDataURL(file);  
      reader.onload = (() => {
        let image = document.createElement('img');
        image.src = reader.result;
        
        image.onload = ((e) => {

          this.setState({
            ...this.state,
            options: (() => {
              let result = [];

              for(let i = 0, len = this.state.options.length; i < len; i++) {
                if (i === index) {
                  result.push(Object.assign(
                    {},
                    this.state.options[i],
                    {
                      data: {
                        location: this.state.options[i].data.location,
                        icon: (new Array(this.state.options[i].data.location.length)).fill(image),
                      },
                      image: image,
                    },
                  ));
                } else {
                  result.push(this.state.options[i]);
                }
              };

              return result;
            })(),
          });
        }).bind(this);
      }).bind(this);
    } else {
      alert('Upload IMAGE Only');
      throw new Error('upload image only');
    }
  };

  updateColor(e) {
    let index = e.target.parentElement.getAttribute('data-id') - 1;
    
    this.setState({
      ...this.state,
      options: (() => {
        let result = [];
        
        for(let i = 0, len = this.state.options.length; i < len; i++) {
          const color = e.target.value;
          
          if (i === index) {
            result.push(Object.assign(
              {},
              this.state.options[i],
              {
                color: color,
              },
            ));
          } else {
            result.push(this.state.options[i]);
          }
        };

        return result;
      })(),
    });
  };

  draw() {
    //see AMap.CustomLayer options
    this.mavas.draw({
      zIndex: 100,
    });
  };
  
  render() {
    return (
      <div>
        <h1>Playground 咱自个儿画图</h1>
        <div>
          <button onClick={this.onNewMarkerClick.bind(this)}>新气泡</button>
          <button onClick={this.onNewPolylineClick.bind(this)}>新线条</button>
        </div>
        <div>
          {
            this.state.options.map((option) => {
              return option.type === 'marker' ? this.markerTemplate(option.id, option.globalId) : this.polylineTemplate(option.id, option.globalId);
            })
          }
        </div>
        <div>
          <button onClick={this.draw.bind(this)}>做图</button>
        </div>
        <div className="map-container" id="map" style={{'height': 'calc(100vh - 400px)'}}></div>
      </div>
    );
  };
};