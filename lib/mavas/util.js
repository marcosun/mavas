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
};

export default Util;