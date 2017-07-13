import TimeAxis from './component/timeAxis';
import paddleImg from './image/timeAxis/paddle.svg';

//load paddle icon
let paddle = document.createElement('img');
paddle.src = paddleImg;

export default class Component {
  constructor() {
    this.components = [];
  };
  
  createComponent(outerOptions) {
    let options;
    
    switch(outerOptions.type) {
      case 'timeAxis':
        /*
          *@param {String} type [compulsory]
          *@param {String} id [compulsory: html canvas tag id]
          *@param {Array} data [compulsory: time axis]
          *@param {Function} onDrag [optional: on drag callback]
          *@param {Number} width [optional: component width, default to window.innerWidth]
          *@param {Number} height [optional: component height, default to 42]
          *@param {Number} scrollBorderWidth [optional: scroll border width, default to 1]
          *@param {String} scrollColor [optional: scroll border colour, default to #DFDFDF]
          *@param {String} labelColor [optional: label colour, default to #545454]
          *@param {Number} labelSize [optional: label font size, default to 14]
          *@param {String} coverColor [optional: cover colour, default to rgba(193, 206, 213, 0.3)]
          *@return {Palette} palette [Palette instance]
        */
        options = {
          type: outerOptions.type,
          id: typeof outerOptions.id === 'string' ? outerOptions.id : undefined,
          data: outerOptions.data instanceof Array ? outerOptions.data : undefined,
          onDrag: outerOptions.onDrag instanceof Function ? outerOptions.onDrag : undefined,
          width: typeof outerOptions.width === 'number' ? outerOptions.width : window.innerWidth,
          height: typeof outerOptions.height === 'number' ? outerOptions.height : 42,
          paddle: paddle, //paddle image
          scrollBorderWidth: typeof outerOptions.scrollBorderWidth === 'number' ? outerOptions.scrollBorderWidth : 1,
          scrollColor: typeof outerOptions.scrollColor === 'string' ? outerOptions.scrollColor : '#DFDFDF',
          labelColor: typeof outerOptions.labelColor === 'string' ? outerOptions.labelColor : '#545454',
          labelSize: typeof outerOptions.labelSize === 'number' ? outerOptions.number : 14,
          coverColor: typeof outerOptions.coverColor === 'string' ? outerOptions.coverColor : 'rgba(193, 206, 213, 0.3)',
        };
        break;
      default:
        throw new Error('unknown component type');
    };
    
    this.createTool(options);
  };
  
  createTool(options) {
    let component;
    
    component = new TimeAxis();
    this.components.push(component);
    component.config(options);
    
    return component;
  };
};