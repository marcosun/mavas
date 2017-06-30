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
          <li><Link to="/polyline">polyline 曲线图</Link></li>
          <li><Link to="/curve">curve 曲线图</Link></li>
          <li><Link to="/marker">marker 气泡图</Link></li>
          <li><Link to="/external">external 第三方图像集成</Link></li>
          <br />
          <li><Link to="/releasenote">releasenote</Link></li>
          <br />
          <h2>Public Transport Dept. Demo 公交云需求</h2>
          <li><Link to="/phonePaySummary">bus phone pay summary 公交车无线支付统计</Link></li>
          <li><Link to="/originDestinationSummary">origin destination summary 交通量调查</Link></li>
          <li><Link to="/heatmap">heatmap 无线支付热力图</Link></li>
        </ul>
      </div>
    );
  };
};