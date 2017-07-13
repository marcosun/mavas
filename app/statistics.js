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
    
    this.mapCanvasToApi = (canvasName) => {
      const mapping = {
        phonePay: 'http://10.85.1.171:8080/trend',
        busRoute: 'http://10.85.1.171:8080/groupByBusline',
        busStop: 'http://10.85.1.171:8080/getByStation?limit=10',
        multipleConfirmation: 'http://10.85.1.171:8080/groupMulConfirm',
      }
      
      return mapping[canvasName];
    };
    
    this.base = {
      canvas: undefined,
      echart: undefined,
      option: undefined,
      data: undefined,
      isFetching: true,
    };
    this.phonePay = {...this.base};
    this.busRoute = {...this.base};
    this.busStop = {...this.base};
    this.multipleConfirmation = {...this.base};
    
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 15);
    this.endDate = new Date();
  };
  
  componentDidMount() {
    
    const assignCanvas = (canvasName) => {
      return {
        ...this[canvasName],
        canvas: document.getElementById(canvasName),
      };
    };
    
    this.phonePay = assignCanvas('phonePay');
    this.busRoute = assignCanvas('busRoute');
    this.busStop = assignCanvas('busStop');
    this.multipleConfirmation = assignCanvas('multipleConfirmation');
    
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
    const initConstructor = (canvasName) => {
      return () => {
        this[canvasName].echart = echarts.init(this[canvasName].canvas);

        return request.get(this.mapCanvasToApi(canvasName))
          .query({
            startDate: `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`,
            endDate: `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`,
          })
          .then((res) => {
            this[canvasName].isFetching = false;
            this[canvasName].data = res.body;

            return new Promise((resolve, reject) => {
              resolve();
            });
          });
      };
    };
    
    const initPhonePay = initConstructor('phonePay');
    const initBusRoute = initConstructor('busRoute');
    const initBusStop = initConstructor('busStop');
    const initMultipleConfirmation = initConstructor('multipleConfirmation');
    
    Promise.all([initPhonePay(), initBusRoute(), initBusStop(), initMultipleConfirmation()])
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
        <h1>过去15日统计汇总</h1>
        <strong>请求API状态：<em>{this.state.isError ? '请求失败' : (this.state.isFetching ? '正在请求' : '请求成功')}</em></strong>
        <div id="phonePay" style={{"width": "100%", "height": "600px"}}></div>
        <div id="busRoute" style={{"width": "100%", "height": "600px"}}></div>
        <div id="busStop" style={{"width": "100%", "height": "600px"}}></div>
        <div id="multipleConfirmation" style={{"width": "100%", "height": "600px"}}></div>
      </div>
    );
  };
};