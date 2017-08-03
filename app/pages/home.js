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
          <li><Link to="/statistics">Statistics 统计数据汇总</Link></li>
          <li><Link to="/stationWithCitizenCard">市民卡站点统计</Link></li>
          <li><Link to="/routeWithCitizenCard">市民卡线路统计</Link></li>
          <li><Link to="/migration">Migration 区域人口流动</Link></li>
          <li><Link to="/originDestinationSummary">Origin Destination Summary 交通量调查</Link></li>
          <li><Link to="/heatmap">Heatmap 无线支付热力图</Link></li>
          <li><Link to="/playground">Playground 咱自个儿画图</Link></li>
        </ul>
      </div>
    );
  };
};