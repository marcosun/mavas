import Component from './component';
import Palette from './palette';
import transformOptions from './common/options';

/**
 * @module Composer
 * @namespace Composer
 * @extends Component
 * @desc Class representing Composer -- Expose create and draw palette apis
 */
export default class Composer extends Component {
  constructor() {
    super();
    this.customLayers = [];
  }

  /**
   * Same as CreatePalette
   * @namespace Composer
   * @function
   * @deprecated
   */
  createLayer(outerOptions) {
    return this.createPalette(outerOptions);
  }

  /**
   * CreatePalette
   * @function
   * @param  {Object} outerOptions Configurations
   * @return {Object}              Object representing palette and can be manipulated with its apis
   * @desc Create a palette, save, and simply return this palette
   */
  createPalette(outerOptions) {
    let options = transformOptions(outerOptions); // Validate options

    let palette = new Palette(this.map, options); // Create palette

    this.customLayers.push(palette); //Save palette
    palette.import(options.data); // Pass json data to palette
    
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