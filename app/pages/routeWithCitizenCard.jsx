import React from 'react';
import echarts from 'echarts';
import request from 'superagent';

import Util from '../../lib/mavas/util';

export default class RouteWithCitizenCard extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      isError: false,
      isFetching: true,
    };
  };
  
  componentDidMount() {
    this.chart = {
      canvas: document.getElementById('chart'),
      echarts: echarts.init(document.getElementById('chart')),
      data: undefined,
    };
    
    this.draw()
  };
  
  draw() {
    this.fetchData()
    .then(this.drawWithEcharts.bind(this));
  };
  
  fetchData() {
    const params = this.getDates();
    
    return request.get(`${__API_ROOT__}/citizen/groupByRoute`)
    .query({
      ...params,
      limit: 15,
    })
    .then((res) => {
      this.setState({
        isError: false,
        isFetching: false,
      });
      
      this.chart.data = res.body
      
      return new Promise((resolve, reject) => {
        resolve(res.body);
      });
    });
  };
  
  getDates() {
    const startDate = new Date(),
          endDate = new Date();
    startDate.setDate(startDate.getDate() - 15);
    
//    return {
//      startDate: startDate.toJSON().slice(0, 10),
//      endDate: endDate.toJSON().slice(0, 10),
//    };
    
    return {
      startDate: '2017-01-01',
      endDate: '2017-08-02',
    };
  };
  
  drawWithEcharts(data) {
    this.setChartOptions(data);
  };
  
  setChartOptions(data) {
    this.chart.options = {
      color: ['#3398DB'],
      title: {
        text: '市民卡线路统计',
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {
          type : 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        name: '线路',
        nameLocation: 'middle',
        nameGap: 20,
        data: Util.pluck(data, 'routeName'),
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: '人次',
      },
      series: [
        {
          name:'人次',
          type:'bar',
          barWidth: '60%',
          data: Util.pluck(data, 'count'),
        }
      ],
    };
    
    this.chart.echarts.setOption(this.chart.options, true);
  };
  
  render() {
    return (
      <div>
        <h1>市民卡线路统计</h1>
        <strong>请求API状态：<em>{this.state.isError ? '请求失败' : (this.state.isFetching ? '正在请求' : '请求成功')}</em></strong>
        <div className="map-container" id="chart"></div>
      </div>
    );
  };
};