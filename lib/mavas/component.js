import TimeAxis from './component/timeAxis';

export default class Component {
  constructor() {
    this.components = [];
  };
  
  createComponent(outerOptions) {
    let options;
    
    switch(outerOptions.type) {
      case 'timeAxis':
        options = {
          type: outerOptions.type,
          id: typeof outerOptions.id === 'string' ? outerOptions.id : undefined,
          width: typeof outerOptions.width === 'number' ? outerOptions.width : window.innerWidth,
          height: typeof outerOptions.height === 'number' ? outerOptions.height : 50,
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