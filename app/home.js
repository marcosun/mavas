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
          <li><Link to="/polyline">polyline曲线图</Link></li>
          <li><Link to="/marker">marker气泡图</Link></li>
          <li><Link to="/external">external第三方图像集成</Link></li>
          <li><Link to="/busTicketSummary">busTicketSummary无限公交支付统计</Link></li>
          <li><Link to="/originDestinationSummary">originDestinationSummary交通量调查</Link></li>
          <li><Link to="/heatmap">heatmap热力图</Link></li>
          <li><Link to="/releasenote">releasenote</Link></li>
        </ul>
      </div>
    );
  };
};