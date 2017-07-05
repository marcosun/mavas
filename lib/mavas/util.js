const toDecimal = (number, decimal) => {
  return Number(number.toFixed(decimal));
};

const isNumber = (number) => {
  return /^[0-9]+$/.test(number);
};

const pluck = (list, name) => {
  let value,
      result = [];
  
  for(let i = 0, len = list.length; i < len; i ++) {
    value = list[i][name];
    
    if (value !== undefined || value !== null) {
      result.push(value);
    }
  }
  
  return result;
};

const offsetCanvasPositionOnDrag = (canvasParentNode) => {
  if (canvasParentNode.style.top[0] === '-') {
    canvasParentNode.style.marginTop = canvasParentNode.style.top.slice(1);
  } else {
    canvasParentNode.style.marginTop = `-${canvasParentNode.style.top}`;
  }

  if (canvasParentNode.style.left[0] === '-') {
    canvasParentNode.style.marginLeft = canvasParentNode.style.left.slice(1);
  } else {
    canvasParentNode.style.marginLeft = `-${canvasParentNode.style.left}`;
  }
};

const resetCanvasPositionAfterDrag = (canvasParentHtml) => {
  canvasParentHtml.style.marginTop = null;
  canvasParentHtml.style.marginLeft = null;
};

function setIsInitialLoadIndicator() {
  if (this.isInitialLoad === true) {
    this.isInitialLoad = false;
  }

  if (this.isInitialLoad === undefined) {
    this.isInitialLoad = true;
  }
};

//TODO: memory leak
const findLast = (array, callback) => {
  let result;
  
  for (let i = array.length - 1; i >= 0; i --) {
    if (callback(array[i], i, array) === true) {
      result = array[i];
      break;
    }
  };
  
  return result;
};

const findAll = (array, evaluate) => {
  let result = [];
  
  for(let i = 0, len = array.length; i < len; i++) {
    if (evaluate(array[i], i, array) === true) {
      result.push(array[i]);
    }
  };
  
  return result;
};

const findIndex = (array, evaluate) => {
  let result = [];
  
  for(let i = 0, len = array.length; i < len; i++) {
    if (evaluate(array[i], i, array) === true) {
      result.push(i);
    }
  };
  
  return result;
};

const flatten = (array) => {
  const flattenForEachElement = (array) => {
    for(let i = 0, len = array.length; i < len; i++) {
      if (array[i] instanceof Array) {
        flattenForEachElement(array[i]);
      } else {
        result.push(array[i]);
      }
    };
  };
  
  let result = [];
  
  if (!array instanceof Array) {
    throw new Error('this function applies to Array only');
  }
  
  flattenForEachElement(array);
  
  return result;
};

const unique = (array) => {
  let result = [], lookup = {}, value, type;
  
  if (!array instanceof Array) {
    throw new Error('this function applies to Array only');
  }
  
  for(let i = 0, len = array.length; i < len; i++) {
    value = array[i];
    type = typeof value;
    
    if (!lookup[value]) {
      lookup[value] = [type];
      result.push(value);
    } else if (lookup[value].indexOf(type) < 0) {
      lookup[value].push(type);
      result.push(value);
    }
  };
  
  return result;
};

class Delay {
  constructor(interval) {
    this.interval = interval;
  };
  
  exec(callback) {
    this.delayId !== undefined && clearTimeout(this.delayId);
    
    this.delayId = setTimeout(() => {
      this.delayId = undefined;
      callback();
    }, this.interval);
  };
  
  execNodelay(callback) {
    this.delayId !== undefined && clearTimeout(this.delayId) === undefined && (this.delayId = undefined);
    
    callback();
  };
};

//TODO: this function yet to be completed
const Mixin = (childClass, superClass) => {
  for (property in superClass) {
    if (Object.hasOwnProperty(superClass, property)) {
      childClass.prototype[property] = superClass[property];
    }
  };
};

function bindDragEvent(callback) {
  const mouseDownHandler = (e) => {
    this.drag.isDrag = true;
    this.drag.isFirstMove = true;
    this.drag.start = e;
    this.drag.end = undefined;
    callback(e);
  };
  
  const mouseUpHandler = (e) => {
    this.drag.isDrag = false;
    this.drag.isFirstMove = false;
    this.drag.end = e;
    callback(e);
  };
  
  const mouseMoveHandler = (e) => {
    if (this.drag.isDrag === true) {
      this.drag.isFirstMove = false;
      callback(e);
    }
  };
  
  this.drag = {
    isDrag: false,
  };
  this.bindEvent('mousedown', mouseDownHandler);
  this.bindEvent('mouseup', mouseUpHandler);
  this.bindEvent('mousemove', mouseMoveHandler);
};

function bindEvent(event, callback) {
  switch(event) {
    case 'drag':
      bindDragEvent.call(this, callback);
      break;
    default:
      this.addEventListener(event, callback);
  };
};

/*
  *@param {{x: Number, y: Number, width: Number, height: Number}} pat [compulsory: x: topLeft corner pixel, y: topLeft corner pixel]
  *@param {{x: Number, y: Number}} point [compulsory: x: point pixel, y: point pixel]
*/
const isPointInPath = (path, point) => {
  let boundary = {
    topLeft: {
      x: path.x,
      y: path.y,
    },
    bottomRight: {
      x: path.x + path.width,
      y: path.y + path.height,
    },
  };
  
  return point.x >= boundary.topLeft.x && point.y >= boundary.topLeft.y && point.x <= boundary.bottomRight.x && point.y <= boundary.bottomRight.y;
};

const Util = {
  toDecimal,
  isNumber,
  pluck,
  offsetCanvasPositionOnDrag,
  resetCanvasPositionAfterDrag,
  setIsInitialLoadIndicator,
  findLast,
  findAll,
  findIndex,
  flatten,
  unique,
  Delay,
  Mixin,
  bindEvent,
  isPointInPath,
};

export default Util;