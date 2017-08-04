import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import echarts from 'echarts';
import request from 'superagent';

import Util from '../../lib/mavas/util';

export default class StationWithCitizenCard extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    
    this.defaultStartDate = new Date();
    this.defaultStartDate.setDate(this.defaultStartDate.getDate() - 15);
    this.defaultEndDate = new Date();
    
    this.state = {
      startDate: `${this.defaultStartDate.getFullYear()}-${this.defaultStartDate.getMonth() + 1}-${this.defaultStartDate.getDate()}`,
      endDate: `${this.defaultEndDate.getFullYear()}-${this.defaultEndDate.getMonth() + 1}-${this.defaultEndDate.getDate()}`,
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
    
    return request.get(`${__API_ROOT__}/citizen/groupByStation`)
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
    return {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };
  };
  
  drawWithEcharts(data) {
    this.setChartOptions(data);
  };
  
  setChartOptions(data) {
    this.chart.options = {
      color: ['#3398DB'],
      title: {
        text: '市民卡站点统计',
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
        name: '站点',
        nameLocation: 'middle',
        nameGap: 20,
        data: Util.pluck(data, 'stationName'),
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
  
  dateChangeHandler(type, ignore, date) {
    switch(type) {
      case 'startDate':
        this.setState({
          ...this.state,
          startDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        });
        break;
      case 'endDate':
        this.setState({
          ...this.state,
          endDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        });
        break;
    };
    
    setTimeout(() => this.draw());
  };
  
  render() {
    return (
      <div>
        <h1>市民卡站点统计</h1>
        <strong>请求API状态：<em>{this.state.isError ? '请求失败' : (this.state.isFetching ? '正在请求' : '请求成功')}</em></strong>
        <div style={{'display': 'flex'}}>
          <DatePicker floatingLabelText="起始日期" defaultDate={this.defaultStartDate} onChange={this.dateChangeHandler.bind(this, 'startDate')}/>
          <DatePicker floatingLabelText="结束日期" defaultDate={this.defaultEndDate} onChange={this.dateChangeHandler.bind(this, 'endDate')}/>
        </div>
        <div className="map-container" id="chart"></div>
      </div>
    );
  };
};