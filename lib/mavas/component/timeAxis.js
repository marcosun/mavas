
export default class TimeAxis {
  constructor() {
    
  };
  
  config(options) {
    this.options = Object.assign({}, options);
    
    this.init();
    this.draw();
  };
  
  draw() {
    const drawScroll = () => {
      this.scroll.ctx.strokeStyle = 'black';
      this.scroll.ctx.strokeRect(0, 0, this.scroll.canvas.width, this.scroll.canvas.height);
    };
    
    const drawPaddleLeft = () => {
      this.paddleLeft.ctx.fillStyle = 'black';
      this.paddleLeft.ctx.fillRect(0, 0, this.paddleLeft.canvas.width, this.paddleLeft.canvas.height);
    };
    
    const drawPaddleRight = () => {
      this.paddleRight.ctx.fillStyle = 'black';
      this.paddleRight.ctx.fillRect(0, 0, this.paddleRight.canvas.width, this.paddleRight.canvas.height);
    };
    
    const drawLabelLeft = () => {
      this.labelLeft.ctx.font = '12px monospace';
      this.labelLeft.ctx.textAlign = 'center';
      this.labelLeft.ctx.textBaseline="middle";
      this.labelLeft.ctx.strokeStyle = 'black';
      this.labelLeft.ctx.fillText('labelLeft', this.labelLeft.canvas.width / 2, this.labelLeft.canvas.height / 2);
    };
    
    const drawLabelRight = () => {
      this.labelRight.ctx.font = '12px monospace';
      this.labelRight.ctx.textAlign = 'center';
      this.labelRight.ctx.textBaseline="middle";
      this.labelRight.ctx.strokeStyle = 'black';
      this.labelRight.ctx.fillText('labelRight', this.labelRight.canvas.width / 2, this.labelRight.canvas.height / 2);
    };
    
    const drawTimeAxis = () => {
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
  
  init() {
    this.canvas = document.getElementById(this.options.id);
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.ctx = this.canvas.getContext('2d');
    
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
      },
    );
    
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
      },
    );
    
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
      },
    );
    
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
      },
    );
  };
};