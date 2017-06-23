import React from 'react';
import echarts from 'echarts';

import Util from '../lib/mavas/util';

let mockData = {
    "alipay": [
        {
            "date": "2017-06-06",
            "count": 127
        },
        {
            "date": "2017-06-07",
            "count": 384
        },
        {
            "date": "2017-06-08",
            "count": 380
        },
        {
            "date": "2017-06-09",
            "count": 448
        },
        {
            "date": "2017-06-10",
            "count": 365
        },
        {
            "date": "2017-06-11",
            "count": 199
        },
        {
            "date": "2017-06-12",
            "count": 132
        },
        {
            "date": "2017-06-13",
            "count": 122
        },
        {
            "date": "2017-06-14",
            "count": 103
        },
        {
            "date": "2017-06-15",
            "count": 101
        },
        {
            "date": "2017-06-16",
            "count": 128
        },
        {
            "date": "2017-06-17",
            "count": 153
        },
        {
            "date": "2017-06-18",
            "count": 135
        },
        {
            "date": "2017-06-19",
            "count": 182
        },
        {
            "date": "2017-06-20",
            "count": 157
        }
    ],
    "virtualcard": [
        {
            "date": "2017-06-06",
            "count": 1120
        },
        {
            "date": "2017-06-07",
            "count": 3533
        },
        {
            "date": "2017-06-08",
            "count": 3810
        },
        {
            "date": "2017-06-09",
            "count": 4640
        },
        {
            "date": "2017-06-10",
            "count": 3972
        },
        {
            "date": "2017-06-11",
            "count": 3817
        },
        {
            "date": "2017-06-12",
            "count": 5729
        },
        {
            "date": "2017-06-13",
            "count": 6413
        },
        {
            "date": "2017-06-14",
            "count": 6224
        },
        {
            "date": "2017-06-15",
            "count": 7045
        },
        {
            "date": "2017-06-16",
            "count": 11875
        },
        {
            "date": "2017-06-17",
            "count": 13449
        },
        {
            "date": "2017-06-18",
            "count": 13573
        },
        {
            "date": "2017-06-19",
            "count": 18637
        },
        {
            "date": "2017-06-20",
            "count": 19228
        }
    ],
    "unionpay": [
        {
            "date": "2017-06-06",
            "count": 18
        },
        {
            "date": "2017-06-07",
            "count": 97
        },
        {
            "date": "2017-06-08",
            "count": 103
        },
        {
            "date": "2017-06-09",
            "count": 123
        },
        {
            "date": "2017-06-10",
            "count": 79
        },
        {
            "date": "2017-06-11",
            "count": 80
        },
        {
            "date": "2017-06-12",
            "count": 105
        },
        {
            "date": "2017-06-13",
            "count": 127
        },
        {
            "date": "2017-06-14",
            "count": 144
        },
        {
            "date": "2017-06-15",
            "count": 1321
        },
        {
            "date": "2017-06-16",
            "count": 12542
        },
        {
            "date": "2017-06-17",
            "count": 21890
        },
        {
            "date": "2017-06-18",
            "count": 23006
        },
        {
            "date": "2017-06-19",
            "count": 28072
        },
        {
            "date": "2017-06-20",
            "count": 31006
        }
    ],
    "all": [
        {
            "date": "2017-06-06",
            "count": 1265
        },
        {
            "date": "2017-06-07",
            "count": 4014
        },
        {
            "date": "2017-06-08",
            "count": 4293
        },
        {
            "date": "2017-06-09",
            "count": 5211
        },
        {
            "date": "2017-06-10",
            "count": 4416
        },
        {
            "date": "2017-06-11",
            "count": 4096
        },
        {
            "date": "2017-06-12",
            "count": 5966
        },
        {
            "date": "2017-06-13",
            "count": 6662
        },
        {
            "date": "2017-06-14",
            "count": 6471
        },
        {
            "date": "2017-06-15",
            "count": 8467
        },
        {
            "date": "2017-06-16",
            "count": 24545
        },
        {
            "date": "2017-06-17",
            "count": 35492
        },
        {
            "date": "2017-06-18",
            "count": 36714
        },
        {
            "date": "2017-06-19",
            "count": 46891
        },
        {
            "date": "2017-06-20",
            "count": 50391
        }
    ]
};

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class BusTicketSummary extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
  };
  
  componentDidMount() {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://10.88.1.227:8080/trend', true);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    request.send('startDate=2017-06-06&endDate=2017-06-23');
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200){
        mockData = JSON.parse(request.response);
      };
      
      this.draw();
    };
  };
  
  draw() {
    let canvas, myChart, option;
    
    canvas = document.getElementById('canvas');
    
    myChart = echarts.init(canvas);
    option = {
        title: {
            text: '公交车移动支付统计',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: Object.keys(mockData),
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
            data: Util.pluck(mockData.alipay, 'date'),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name:'alipay',
                type:'line',
                smooth: true,
                data: Util.pluck(mockData.alipay, 'count'),
            },
            {
                name:'virtualcard',
                type:'line',
                smooth: true,
                data: Util.pluck(mockData.virtualcard, 'count'),
            },
            {
                name:'unionpay',
                type:'line',
                smooth: true,
                data: Util.pluck(mockData.unionpay, 'count'),
            },
            {
                name:'all',
                type:'line',
                smooth: true,
                data: Util.pluck(mockData.all, 'count'),
            },
        ],
    };
    
    myChart.setOption(option, true);
  };
  
  render() {
    return (
      <div>
        <h1>Bus Ticket Summary</h1>
        <div id="canvas" style={{"width": "100%", "height": "600px"}}></div>
      </div>
    );
  };
};