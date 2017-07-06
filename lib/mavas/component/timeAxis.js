import Util from '../util';

export default class TimeAxis {
  constructor() {
    
  };
  
  config(options) {
    this.options = Object.assign({}, options);
    
    this.init();
    this.draw();
  };
  
  /*
    *full of canvas apis
  */
  draw() {
    const drawScroll = () => {
      if (this.scroll.cache === undefined) {
        this.scroll.ctx.strokeStyle = 'black';
        this.scroll.ctx.strokeRect(0, 0, this.scroll.canvas.width, this.scroll.canvas.height);
        this.scroll.cache = {
          canvas: this.scroll.canvas,
        };
      }
    };
    
    const drawPaddleLeft = () => {
      if (this.paddleLeft.cache === undefined) {
        this.paddleLeft.ctx.fillStyle = 'black';
        this.paddleLeft.ctx.fillRect(0, 0, this.paddleLeft.canvas.width, this.paddleLeft.canvas.height);
        this.paddleLeft.cache = {
          canvas: this.paddleLeft.canvas,
        };
      }
    };
    
    const drawPaddleRight = () => {
      if (this.paddleRight.cache === undefined) {
        this.paddleRight.ctx.fillStyle = 'black';
        this.paddleRight.ctx.fillRect(0, 0, this.paddleRight.canvas.width, this.paddleRight.canvas.height);
        this.paddleRight.cache = {
          canvas: this.paddleRight.canvas,
        };
      }
    };
    
    const drawLabelLeft = () => {
      this.labelLeft.ctx.clearRect(0, 0, this.labelLeft.canvas.width, this.labelLeft.canvas.height);
      this.labelLeft.ctx.font = '12px monospace';
      this.labelLeft.ctx.textAlign = 'center';
      this.labelLeft.ctx.textBaseline="middle";
      this.labelLeft.ctx.strokeStyle = 'black';
      this.labelLeft.ctx.fillText(this.labelLeft.text, this.labelLeft.canvas.width / 2, this.labelLeft.canvas.height / 2);
    };
    
    const drawLabelRight = () => {
      this.labelRight.ctx.clearRect(0, 0, this.labelRight.canvas.width, this.labelRight.canvas.height);
      this.labelRight.ctx.font = '12px monospace';
      this.labelRight.ctx.textAlign = 'center';
      this.labelRight.ctx.textBaseline="middle";
      this.labelRight.ctx.strokeStyle = 'black';
      this.labelRight.ctx.fillText(this.labelRight.text, this.labelRight.canvas.width / 2, this.labelRight.canvas.height / 2);
    };
    
    const drawTimeAxis = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.scroll.canvas, this.scroll.position.x, this.scroll.position.y);
      this.ctx.drawImage(this.paddleLeft.canvas, this.paddleLeft.position.x, this.paddleLeft.position.y);
      this.ctx.drawImage(this.paddleRight.canvas, this.paddleRight.position.x, this.paddleRight.position.y);
      this.ctx.drawImage(this.labelLeft.canvas, this.labelLeft.position.x, this.labelLeft.position.y);
      this.ctx.drawImage(this.labelRight.canvas, this.labelRight.position.x, this.labelRight.position.y);
    };
    
    drawScroll();
    drawPaddleLeft();
    drawPaddleRight();
    drawLabelLeft();
    drawLabelRight();
    drawTimeAxis();
  };
  
  /*
    *initialise properties of timeAxis including canvas, scroll, paddles, and labels
  */
  init() {
    const dragEventHandler = (e) => {
      
      /*
        *Priority:
        *1. drag on paddleLeft
        *2. drag on paddleRight
        *3. drag on cover
      */
      const getDragTargetName = () => {
        let dragTargetName = getDragPaddleSide();
        
        if (dragTargetName !== undefined) return dragTargetName;
        
        if (testDragCover() === true) return 'cover'
      };
      
      const testDragCover = () => {
        let leftSide, rightSide;
        
        if (this.paddleLeft.position.x <= this.paddleRight.position.x) {
          leftSide = 'paddleLeft';
          rightSide = 'paddleRight';
        } else {
          leftSide = 'paddleRight';
          rightSide = 'paddleLeft';
        }
        
        return Util.isPointInPath({
          x: this[leftSide].position.x + this[leftSide].canvas.width,
          y: this[leftSide].position.y,
          width: this[rightSide].position.x - this[leftSide].position.x,
          height: this[leftSide].canvas.height,
        }, {
          x: this.canvas.drag.start.layerX,
          y: this.canvas.drag.start.layerY,
        });
      };
      
      /*
        *iterate over two sides of paddles and find if any side is being dragged
        *@return {String} [paddleLeft || paddleRight || undefined]
      */
      const getDragPaddleSide = () => {
        const paddles = ['paddleLeft', 'paddleRight'];
        
        return paddles.find((paddleSide) => {
          return Util.isPointInPath({
            x: this[paddleSide].position.x,
            y: this[paddleSide].position.y,
            width: this[paddleSide].canvas.width,
            height: this[paddleSide].canvas.height,
          }, {
            x: this.canvas.drag.start.layerX,
            y: this.canvas.drag.start.layerY,
          });
        });
      };
      
      /*
        *@param {String} paddleSide [compulsory: paddleLeft || paddleRight]
        *@return {String} [paddleLeft || paddleRight || undefined]
      */
      const dragPaddleHandler = (paddleSide) => {
        const mapDistanceToIndex = (distanceInPercentage, list) => {
          const len = list.length - 1;

          return Math.floor(distanceInPercentage * len);
        };
        
        const updateBothLabels = () => {
          const bindLabelAndPaddle = (labelSide, paddleSide) => {
            const distance = Math.floor(this[paddleSide].position.x - this.labelLeft.canvas.width + this.paddleLeft.canvas.width / 2),
              distanceInPercentage = distance / this.scroll.canvas.width,
              index = mapDistanceToIndex(distanceInPercentage, this.options.data),
              labelText = this.options.data[index];
            
            this[labelSide].text = labelText;
          };
          
          if (this.paddleLeft.position.x <= this.paddleRight.position.x) {
            bindLabelAndPaddle('labelLeft', 'paddleLeft');
            bindLabelAndPaddle('labelRight', 'paddleRight');
          } else {
            bindLabelAndPaddle('labelLeft', 'paddleRight');
            bindLabelAndPaddle('labelRight', 'paddleLeft');
          }
        };
        
        let diffX = e.layerX - this.canvas.drag.start.layerX;

        if (this.canvas.drag.start.layerX + diffX <= this[paddleSide].restrictions.minX) {
          this[paddleSide].position.x = this[paddleSide].restrictions.minX;
        } else if (this.canvas.drag.start.layerX + diffX >= this[paddleSide].restrictions.maxX) {
          this[paddleSide].position.x = this[paddleSide].restrictions.maxX;
        } else {
          this[paddleSide].position.x = this.canvas.drag.start.layerX + diffX;
        }

        updateBothLabels();

        this.draw();
      };
      
      const dragCoverHandler = () => {
        const mapDistanceToIndex = (distanceInPercentage, list) => {
          const len = list.length - 1;

          return Math.floor(distanceInPercentage * len);
        };
        
        const updateBothLabels = () => {
          const bindLabelAndPaddle = (labelSide, paddleSide) => {
            const distance = Math.floor(this[paddleSide].position.x - this.labelLeft.canvas.width + this.paddleLeft.canvas.width / 2),
              distanceInPercentage = distance / this.scroll.canvas.width,
              index = mapDistanceToIndex(distanceInPercentage, this.options.data),
              labelText = this.options.data[index];
            
            this[labelSide].text = labelText;
          };
          
          if (this.paddleLeft.position.x <= this.paddleRight.position.x) {
            bindLabelAndPaddle('labelLeft', 'paddleLeft');
            bindLabelAndPaddle('labelRight', 'paddleRight');
          } else {
            bindLabelAndPaddle('labelLeft', 'paddleRight');
            bindLabelAndPaddle('labelRight', 'paddleLeft');
          }
        };
        
        let diffX = e.layerX - this.canvas.drag.start.layerX,
          restrictedMove = [];
        
        if (this.paddleLeft.positionBeforeDrag.x + diffX <= this.paddleLeft.restrictions.minX) {
          restrictedMove.push(this.paddleLeft.restrictions.minX - this.paddleLeft.positionBeforeDrag.x);
        }
        if (this.paddleLeft.positionBeforeDrag.x + diffX >= this.paddleLeft.restrictions.maxX) {
          restrictedMove.push(this.paddleLeft.restrictions.maxX - this.paddleLeft.positionBeforeDrag.x);
        }
        if (this.paddleRight.positionBeforeDrag.x + diffX <= this.paddleRight.restrictions.minX) {
          restrictedMove.push(this.paddleRight.restrictions.minX - this.paddleRight.positionBeforeDrag.x);
        }
        if (this.paddleRight.positionBeforeDrag.x + diffX >= this.paddleRight.restrictions.maxX) {
          restrictedMove.push(this.paddleRight.restrictions.maxX - this.paddleRight.positionBeforeDrag.x);
        }
        
        if (restrictedMove.length !== 0) {
          if (restrictedMove.length === 2 && (restrictedMove[0] < 0 || restrictedMove[1] < 0)) {
            //if any paddle reached lower bound
            diffX = Math.max.apply(null, restrictedMove);
          } else {
            diffX = Math.min.apply(null, restrictedMove);
          }
        }
        
        this.paddleLeft.position.x = this.paddleLeft.positionBeforeDrag.x + diffX;
        this.paddleRight.position.x = this.paddleRight.positionBeforeDrag.x + diffX;

        updateBothLabels();

        this.draw();
      };
      
      const callOuterOnDrag = () => {
        //call onDrag function with labels and paddles info
        this.options.onDrag(e, {
          paddleLeft: {
            position: this.paddleLeft.position,
          },
          paddleRight: {
            position: this.paddleRight.position,
          },
          labelLeft: {
            text: this.labelLeft.text,
          },
          labelRight: {
            text: this.labelRight.text,
          },
        });
      };
      
      if (this.canvas.drag.isFirstMove === true) {
        //save position before drag
        this.paddleLeft.positionBeforeDrag = Object.assign({}, this.paddleLeft.position);
        this.paddleRight.positionBeforeDrag = Object.assign({}, this.paddleRight.position);
        
        this.canvas.drag.targetName = getDragTargetName();
      }
      
      if (this.canvas.drag.targetName === 'paddleLeft') {
        dragPaddleHandler('paddleLeft');
        callOuterOnDrag();
        return;
      }
      if (this.canvas.drag.targetName === 'paddleRight') {
        dragPaddleHandler('paddleRight');
        callOuterOnDrag();
        return;
      }
      if (this.canvas.drag.targetName === 'cover') {
        dragCoverHandler();
        callOuterOnDrag();
        return;
      }
    };
    
    const initCanvas = () => {
      this.canvas = document.getElementById(this.options.id);
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
      this.ctx = this.canvas.getContext('2d');
      this.canvas.__proto__.bindEvent = Util.bindEvent;
      this.canvas.bindEvent('drag', dragEventHandler);
    };
    
    const initScroll = () => {
      this.scroll = {
        canvas: document.createElement('canvas'),
      };
      this.scroll.canvas.width = this.options.width * 0.8;
      this.scroll.canvas.height = this.options.height * 0.8;
      this.scroll = Object.assign(
        {},
        this.scroll,
        {
          ctx: this.scroll.canvas.getContext('2d'),
          position: {
            x: (this.options.width - this.scroll.canvas.width) / 2,
            y: (this.options.height - this.scroll.canvas.height) / 2,
          },
        },
      );
    };
    
    const initCover = () => {
//      this.cover = {
//        canvas: document.createElement('canvas'),
//      };
//      this.cover.canvas.width = this.options.width * 0.8;
//      this.cover.canvas.height = this.options.height * 0.8;
//      this.cover = Object.assign(
//        {},
//        this.cover,
//        {
//          ctx: this.cover.canvas.getContext('2d'),
//          position: {
//            x: 0,
//            y: 0,
//          },
//        },
//      );
    };
    
    const initPaddleLeft = () => {
      this.paddleLeft = {
        canvas: document.createElement('canvas'),
      };
      this.paddleLeft.canvas.width = 6;
      this.paddleLeft.canvas.height = this.options.height * 0.85;
      this.paddleLeft = Object.assign(
        {},
        this.paddleLeft,
        {
          ctx: this.paddleLeft.canvas.getContext('2d'),
          position: {
            x: (this.options.width - this.scroll.canvas.width - this.paddleLeft.canvas.width) / 2,
            y: (this.options.height - this.paddleLeft.canvas.height) / 2,
          },
          positionBeforeDrag: {
            x: (this.options.width - this.scroll.canvas.width - this.paddleLeft.canvas.width) / 2,
            y: (this.options.height - this.paddleLeft.canvas.height) / 2,
          },
          restrictions: {
            minX: (this.options.width - this.scroll.canvas.width - this.paddleLeft.canvas.width) / 2,
            maxX: (this.options.width + this.scroll.canvas.width - this.paddleLeft.canvas.width) / 2,
          },
        },
      );
    };
    
    const initPaddleRight = () => {
      this.paddleRight = {
        canvas: document.createElement('canvas'),
      };
      this.paddleRight.canvas.width = 6;
      this.paddleRight.canvas.height = this.options.height * 0.85;
      this.paddleRight = Object.assign(
        {},
        this.paddleRight,
        {
          ctx: this.paddleRight.canvas.getContext('2d'),
          position: {
            x: (this.options.width + this.scroll.canvas.width - this.paddleRight.canvas.width) / 2,
            y: (this.options.height - this.paddleRight.canvas.height) / 2,
          },
          positionBeforeDrag: {
            x: (this.options.width + this.scroll.canvas.width - this.paddleRight.canvas.width) / 2,
            y: (this.options.height - this.paddleRight.canvas.height) / 2,
          },
          restrictions: {
            minX: (this.options.width - this.scroll.canvas.width - this.paddleLeft.canvas.width) / 2,
            maxX: (this.options.width + this.scroll.canvas.width - this.paddleLeft.canvas.width) / 2,
          },
        },
      );
    };
    
    const initLabelLeft = () => {
      this.labelLeft = {
        canvas: document.createElement('canvas'),
      };
      this.labelLeft.canvas.width = this.options.width * 0.1;
      this.labelLeft.canvas.height = this.options.height;
      this.labelLeft = Object.assign(
        {},
        this.labelLeft,
        {
          ctx: this.labelLeft.canvas.getContext('2d'),
          position: {
            x: 0,
            y: 0,
          },
          text: this.options.data[0],
        },
      );
    };
    
    const initLabelRight = () => {
      this.labelRight = {
        canvas: document.createElement('canvas'),
      };
      this.labelRight.canvas.width = this.options.width * 0.1;
      this.labelRight.canvas.height = this.options.height;
      this.labelRight = Object.assign(
        {},
        this.labelRight,
        {
          ctx: this.labelRight.canvas.getContext('2d'),
          position: {
            x: this.options.width - this.labelRight.canvas.width,
            y: 0,
          },
          text: this.options.data.slice(-1),
        },
      );
    };
    
    initCanvas();
    initScroll();
    initPaddleLeft();
    initPaddleRight();
    initLabelLeft();
    initLabelRight();
  };
};