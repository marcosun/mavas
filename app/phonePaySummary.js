import React from 'react';
import echarts from 'echarts';
import request from 'superagent';

import Util from '../lib/mavas/util';

export default class PhonePaySummary extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isFetching: true,
    };
    this.echart = {
      phonePay: undefined,
      busRoute: undefined,
      busStop: undefined,
    };
  };
  
  componentDidMount() {
    this.canvas = {
      phonePay: document.getElementById('phonePay'),
      busRoute: document.getElementById('busRoute'),
      busStop: document.getElementById('busStop'),
    };
    
    this.init();
  };
  
  draw() {
    const drawPhonePay = () => {
      this.option = {
          title: {
              text: '公交车无线支付统计',
          },
          tooltip: {
              trigger: 'axis',
          },
          legend: {
              data: Object.keys(this.data),
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
          },
          toolbox: {
              feature: {
                  saveAsImage: {},
              },
          },
          xAxis: {
              type: 'category',
              name: '日期',
              nameLocation: 'middle',
              nameGap: 20,
              boundaryGap: false,
              data: Util.pluck(this.data.alipay, 'date'),
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
                  data: Util.pluck(this.data.alipay, 'count'),
              },
              {
                  name:'virtualcard',
                  type:'line',
                  smooth: true,
                  data: Util.pluck(this.data.virtualcard, 'count'),
              },
              {
                  name:'unionpay',
                  type:'line',
                  smooth: true,
                  data: Util.pluck(this.data.unionpay, 'count'),
              },
              {
                  name:'all',
                  type:'line',
                  smooth: true,
                  data: Util.pluck(this.data.all, 'count'),
              },
          ],
      };

      this.echart.phonePay.setOption(this.option, true);
    };
    
    drawPhonePay();
  };
  
  init() {
    const initPhonePay = () => {
      this.echart.phonePay = echarts.init(this.canvas.phonePay);

      let today = new Date(),
        startDate = new Date();
      startDate.setDate(startDate.getDate() - 15);

      request.post('http://10.85.1.171:8080/trend')
        .type('form')
        .send({
          startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().length === 1 ? '0' + (startDate.getMonth() + 1) : startDate.getMonth() + 1}-${startDate.getDate().toString().length === 1 ? '0' + startDate.getDate() : startDate.getDate()}`,
          endDate: `${today.getFullYear()}-${(today.getMonth() + 1).toString().length === 1 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1}-${today.getDate().toString().length === 1 ? '0' + today.getDate() : today.getDate()}`,
        })
        .then((res) => {
          this.setState({
            isFetching: false,
          });
          this.data = res.body;
          this.draw();
        });
    };
    
    initPhonePay();
  };
  
  render() {
    return (
      <div>
        <h1>统计图</h1>
        <strong>请求API状态：<em>{this.state.isFetching ? '正在请求' : '请求成功'}</em></strong>
        <div id="phonePay" style={{"width": "100%", "height": "600px"}}></div>
        <div id="busRoute" style={{"width": "100%", "height": "600px"}}></div>
        <div id="busStop" style={{"width": "100%", "height": "600px"}}></div>
      </div>
    );
  };
};