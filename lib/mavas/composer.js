import Component from './component';
import Palette from './palette';
import transformOptions from './common/options';

export default class Composer extends Component {
  constructor() {
    super();
    this.customLayers = [];
  }
  
  /*
    *@param {String} type [compulsory; external || polyline]
    *init custom layer based on layer type
  */
  createLayer(outerOptions) {
    let options = transformOptions(outerOptions);
    
    return this.createPalette(options);
  }
  
  createPalette(options) {
    let palette;
    
    palette = new Palette(this.map, options);
    this.customLayers.push(palette);
    palette.import(options.data);
    
    return palette;
  }
  
  draw(options) {
    //TODO: now supports palette only
    let customLayer,
      currentLayer;
    
    for(let i = 0, len = this.customLayers.length; i < len; i++) {
      currentLayer = this.customLayers[i];
      customLayer = new window.AMap.CustomLayer(currentLayer.canvas, options);
      customLayer.render = currentLayer.draw.bind(currentLayer);
      customLayer.setMap(this.map);
    }
  }
}