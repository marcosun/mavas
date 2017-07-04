import React from 'react';
import echarts from 'echarts';
import request from 'superagent';

import Util from '../lib/mavas/util';

export default class Statistics extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isFetching: true,
      isError: false,
    };
    this.phonePay = {
      canvas: undefined,
      echart: undefined,
      option: undefined,
      data: undefined,
      isFetching: true,
    };
    
    this.busRoute = {
      canvas: undefined,
      echart: undefined,
      option: undefined,
      data: undefined,
      isFetching: true,
    };
    
    this.busStop = {
      canvas: undefined,
      echart: undefined,
      option: undefined,
      data: undefined,
      isFetching: true,
    };
    
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 30);
    this.endDate = new Date();
  };
  
  componentDidMount() {
    this.phonePay = {
      ...this.phonePay,
      canvas: document.getElementById('phonePay'),
    };
    this.busRoute = {
      ...this.busRoute,
      canvas: document.getElementById('busRoute'),
    };
    this.busStop = {
      ...this.busStop,
      canvas: document.getElementById('busStop'),
    };
    
    this.init();
  };
  
  draw() {
    const drawPhonePay = () => {
      this.phonePay.option = {
          title: {
              text: '公交车无线支付统计',
          },
          tooltip: {
              trigger: 'axis',
          },
          legend: {
              data: Object.keys(this.phonePay.data),
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
          },
          xAxis: {
              type: 'category',
              name: '日期',
              nameLocation: 'middle',
              nameGap: 20,
              boundaryGap: false,
              data: Util.pluck(this.phonePay.data.alipay, 'date'),
          },
          yAxis: {
              type: 'value',
              name: '使用频率（单位：次）',
          },
          series: [
              {
                  name:'alipay',
                  type:'line',
                  smooth: true,
                  data: Util.pluck(this.phonePay.data.alipay, 'count'),
              },
              {
                  name:'virtualcard',
                  type:'line',
                  smooth: true,
                  data: Util.pluck(this.phonePay.data.virtualcard, 'count'),
              },
              {
                  name:'unionpay',
                  type:'line',
                  smooth: true,
                  data: Util.pluck(this.phonePay.data.unionpay, 'count'),
              },
              {
                  name:'all',
                  type:'line',
                  smooth: true,
                  data: Util.pluck(this.phonePay.data.all, 'count'),
              },
          ],
      };

      this.phonePay.echart.setOption(this.phonePay.option, true);
    };
    
    const drawBusRoute = () => {
      this.busRoute.option = {
          color: ['#3398DB'],
          title: {
              text: '公交线路TOP10',
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
              name: '公交线路',
              nameLocation: 'middle',
              nameGap: 20,
              data: Util.pluck(this.busRoute.data, 'routeName'),
              axisTick: {
                  alignWithLabel: true
              }
          },
          yAxis: {
              type: 'value',
              name: '刷卡次数',
          },
          series: [
              {
                  name:'刷卡次数',
                  type:'bar',
                  barWidth: '60%',
                  data: Util.pluck(this.busRoute.data, 'count'),
              }
          ],
      };

      this.busRoute.echart.setOption(this.busRoute.option, true);
    };
    
    const drawBusStop = () => {
      this.busStop.option = {
          color: ['#3398DB'],
          title: {
              text: '公交站TOP10',
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
              name: '公交站',
              nameLocation: 'middle',
              nameGap: 20,
              data: Util.pluck(this.busStop.data, 'stationName'),
              axisTick: {
                  alignWithLabel: true
              }
          },
          yAxis: {
              type: 'value',
              name: '刷卡次数',
          },
          series: [
              {
                  name:'刷卡次数',
                  type:'bar',
                  barWidth: '60%',
                  data: Util.pluck(this.busStop.data, 'count'),
              }
          ],
      };

      this.busStop.echart.setOption(this.busStop.option, true);
    };
    
    drawPhonePay();
    drawBusRoute();
    drawBusStop();
  };
  
  init() {
    const initPhonePay = () => {
      this.phonePay.echart = echarts.init(this.phonePay.canvas);

      return request.post('http://10.85.1.171:8080/trend')
        .type('form')
        .send({
          startDate: `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`,
          endDate: `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`,
        })
        .then((res) => {
          this.phonePay.isFetching = false;
          this.phonePay.data = res.body;
          
          return new Promise((resolve, reject) => {
            resolve();
          });
        });
    };
    
    const initBusRoute = () => {
      this.busRoute.echart = echarts.init(this.busRoute.canvas);
      
      return request.post('http://10.85.1.171:8080/groupByBusline')
        .type('form')
        .send({
          startDate: `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`,
          endDate: `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`,
        })
        .then((res) => {
          this.busRoute.isFetching = false;
          this.busRoute.data = res.body;
          
          return new Promise((resolve, reject) => {
            resolve();
          });
        });
    };
    
    const initBusStop = () => {
      this.busStop.echart = echarts.init(this.busStop.canvas);
      
      return request.post('http://10.85.1.171:8080/getByStation')
        .type('form')
        .send({
          startDate: `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`,
          endDate: `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`,
        })
        .then((res) => {
          this.busStop.isFetching = false;
          this.busStop.data = res.body.slice(0, 10);
          
          return new Promise((resolve, reject) => {
            resolve();
          });
        });
    };
    
    Promise.all([initPhonePay(), initBusRoute(), initBusStop()])
      .then(() => {
        this.setState({
          ...this.state,
          isFetching: false,
          isError: false,
        });
        this.draw();
      })
      .catch((e) => {
        this.setState({
          ...this.state,
          isFetching: false,
          isError: true,
        });
      });
  };
  
  render() {
    return (
      <div>
        <h1>过去30日统计汇总</h1>
        <strong>请求API状态：<em>{this.state.isError ? '请求失败' : (this.state.isFetching ? '正在请求' : '请求成功')}</em></strong>
        <div id="phonePay" style={{"width": "100%", "height": "600px"}}></div>
        <div id="busRoute" style={{"width": "100%", "height": "600px"}}></div>
        <div id="busStop" style={{"width": "100%", "height": "600px"}}></div>
      </div>
    );
  };
};