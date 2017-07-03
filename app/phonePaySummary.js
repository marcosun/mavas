import React from 'react';
import echarts from 'echarts';

import Util from '../lib/mavas/util';

export default class PhonePaySummary extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isFetching: true,
    };
  };
  
  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    
    this.myChart = echarts.init(this.canvas);
    
    let today = new Date(),
      startDate = new Date();
    startDate.setDate(startDate.getDate() - 15);
    
    var request = new XMLHttpRequest();
    request.open('POST', 'http://10.85.1.171:8080/trend', true);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    request.send(`startDate=${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().length === 1 ? '0' + (startDate.getMonth() + 1) : startDate.getMonth() + 1}-${startDate.getDate().toString().length === 1 ? '0' + startDate.getDate() : startDate.getDate()}&endDate=${today.getFullYear()}-${(today.getMonth() + 1).toString().length === 1 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1}-${today.getDate().toString().length === 1 ? '0' + today.getDate() : today.getDate()}`);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200){
        this.setState({
          isFetching: false,
        });
        this.data = JSON.parse(request.response);
        this.draw();
      };
    };
  };
  
  draw() {
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
    
    this.myChart.setOption(this.option, true);
  };
  
  render() {
    return (
      <div>
        <h1>Bus Phone Pay Summary</h1>
        <strong>请求API状态：<em>{this.state.isFetching ? '正在请求' : '请求成功'}</em></strong>
        <div id="canvas" style={{"width": "100%", "height": "calc(100vh - 110px)"}}></div>
      </div>
    );
  };
};