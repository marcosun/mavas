import React from 'react';

export default class Polyline extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
  };
  
  render() {
    return (
      <div>
        <h1>Mavas Release Note</h1>
        <div>
          <h2>Pre Release Version 0.0.3</h2>
          <em>Scheduled July 27, 2017</em>
          <ol>
            <li>Place an external canvas that fixed on somewhere on screen by calling createLayer with type property equals to 'fixedScreenExternal'</li>
            <li>Place an external canvas that fixed on a geographical location by calling createLayer with type property equals to 'fixedLocationExternal'</li>
            <li>canvasApi draw functions accept Boolean isForceDraw parameter to force redraw</li>
            <li>{'createLayer now accepts data in the format of : data: {location: [Array], icon: [Array]}'}</li>
            <li>Expose curve contructor to link two data points by semi curves</li>
            <li>Users should explicitly call createLayer constructor to draw tooltip</li>
            <li>Tooltip will show all tooltips that covers a certain point by setting cumulative to true</li>
            <li>Tooltip exposes config apis to control how tooltips should look like, such as padding, width, lineHeight, color, backgroundColor, and etc</li>
          </ol>
        </div>
        <div>
          <h2>Version 0.0.2</h2>
          <em>July 20, 2017</em>
          <ol>
            <li>Redraw and show extended areas when map moves by configuring realtime property. Be aware of lattency in case of big data</li>
            <li>Exposes api to reset centre and zoom level of the map to cover all data points of a palette</li>
            <li>Disable tooltip when map moves</li>
          </ol>
        </div>
        <div>
          <h2>Version 0.0.1</h2>
          <em>July 14, 2017</em>
          <ol>
            <li>Mavas can be splitted into four parts based on their functions: Mavas-Composer-Palette-CanvasApi(Polyline/Marker)</li>
            <li>Mavas exposes constructor, stores amap instance, and it inherits from Composer.</li>
            <li>Composer exposes apis to create multiple layers, where each layer is a canvas instance. It creates, imports and stores layers from both internal (i.e. layer that is created by a palette) and external. The main purpose of Composer is to manage, organise and compose layers</li>
            <li>Palette is a construction function for creating a specific interal layer. It will create an instance containing canvas instance, config options of that canvas, apis that can manipulate with the graph, such as data import functions and canvas rendering functions. Thumb of rules: one type of graph one Palette instance. Use Composer to create and compose complex graphs</li>
            <li>CanvasApi refers to Polyline, Marker and many more components that consist of canvas apis drawing a specific graph. Obiously this is where magic happens. One should focus on these Components for new functionalities and performance enhancement</li>
            <li>'9 blocks' algo is <strong>STRONGLY</strong> recommanded for polylines. see paper '9 blocks algo' for details</li>
            <li>Polylines are default to be drawn at once, however a delay property can specify how many lines to be drawn for how long time interval in order to make web page more responsive</li>
            <li>Polyline color support</li>
            <li>Marker and Tooltip layers</li>
            <li>Long live Mavas :D</li>
          </ol>
        </div>
      </div>
    );
  };
};