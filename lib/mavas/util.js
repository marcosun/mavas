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

const Util = {
  toDecimal,
  isNumber,
  pluck,
  offsetCanvasPositionOnDrag,
  resetCanvasPositionAfterDrag,
  setIsInitialLoadIndicator,
};

export default Util;