import React from 'react';
import echarts from 'echarts';

import Util from '../lib/mavas/util';

export default class BusTicketSummary extends React.Component {
  
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
    
    var request = new XMLHttpRequest();
    request.open('POST', 'http://10.88.1.227:8080/trend', true);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    request.send('startDate=2017-06-06&endDate=2017-06-23');
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
            text: '公交车移动支付统计',
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
            boundaryGap: false,
            data: Util.pluck(this.data.alipay, 'date'),
        },
        yAxis: {
            type: 'value',
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
        <h1>Bus Ticket Summary</h1>
        <strong>请求API状态：<em>{this.state.isFetching ? '正在请求' : '请求成功'}</em></strong>
        <div id="canvas" style={{"width": "100%", "height": "600px"}}></div>
      </div>
    );
  };
};