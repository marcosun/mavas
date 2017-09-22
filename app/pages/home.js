import React from 'react';
import {
  Link,
} from 'react-router-dom';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  };
  
  render() {
    return (
      <div>
        <h1>Index</h1>
        <ul>
          <h2>Mavas Demo</h2>
          <li><Link to="/polyline">Polyline 曲线图</Link></li>
          <li><Link to="/curve">Curve 曲线图</Link></li>
          <li><Link to="/marker">Marker 气泡图</Link></li>
          <li><Link to="/external">External 第三方图像集成</Link></li>
          <br />
          <li><Link to="/releasenote">releasenote</Link></li>
          <br />
          <h2>Public Transport Dept. Demo 公交云需求</h2>
          <li><Link to="/bq">扁鹊</Link></li>
          <li><Link to="/traffic">实时路况</Link></li>
          <li><Link to="/playground">Playground 咱自个儿画图</Link></li>
        </ul>
      </div>
    );
  };
};