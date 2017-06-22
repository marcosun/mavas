import React from 'react';
import echarts from 'echarts';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

const data = [
    {
        "id": "594b79a7eb98533210396792",
        "startStation": "汽车北站",
        "endStation": "湖州街上塘路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.11318363,
            "y": 30.31895326,
            "type": "Point",
            "coordinates": [
                120.11318363,
                30.31895326
            ]
        },
        "endLocation": {
            "x": 120.14741338,
            "y": 30.32485821,
            "type": "Point",
            "coordinates": [
                120.14741338,
                30.32485821
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 4
    },
    {
        "id": "594b79a7eb9853321039683e",
        "startStation": "西溪竞舟苑",
        "endStation": "节能公司",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.05796975,
            "y": 30.28266614,
            "type": "Point",
            "coordinates": [
                120.05796975,
                30.28266614
            ]
        },
        "endLocation": {
            "x": 120.11951094,
            "y": 30.28227538,
            "type": "Point",
            "coordinates": [
                120.11951094,
                30.28227538
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 4
    },
    {
        "id": "594b79a7eb985332103967db",
        "startStation": "陆板桥",
        "endStation": "黄龙公交站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.06184801,
            "y": 30.32181808,
            "type": "Point",
            "coordinates": [
                120.06184801,
                30.32181808
            ]
        },
        "endLocation": {
            "x": 120.13813211,
            "y": 30.27056528,
            "type": "Point",
            "coordinates": [
                120.13813211,
                30.27056528
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594b79a7eb9853321039683f",
        "startStation": "西溪竞舟苑",
        "endStation": "花园西村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.05793974,
            "y": 30.28299612,
            "type": "Point",
            "coordinates": [
                120.05793974,
                30.28299612
            ]
        },
        "endLocation": {
            "x": 120.12757626,
            "y": 30.2827887,
            "type": "Point",
            "coordinates": [
                120.12757626,
                30.2827887
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594b79a7eb9853321039688d",
        "startStation": "小车桥",
        "endStation": "汽车西站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.15941444,
            "y": 30.25828066,
            "type": "Point",
            "coordinates": [
                120.15941444,
                30.25828066
            ]
        },
        "endLocation": {
            "x": 120.09133684,
            "y": 30.26197608,
            "type": "Point",
            "coordinates": [
                120.09133684,
                30.26197608
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594b79a7eb985332103968b9",
        "startStation": "西溪竞舟苑",
        "endStation": "新河坝巷",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.05792971,
            "y": 30.28286609,
            "type": "Point",
            "coordinates": [
                120.05792971,
                30.28286609
            ]
        },
        "endLocation": {
            "x": 120.14852695,
            "y": 30.28394149,
            "type": "Point",
            "coordinates": [
                120.14852695,
                30.28394149
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594b79a7eb9853321039676f",
        "startStation": "建兰中学",
        "endStation": "孩儿巷",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.17450759,
            "y": 30.23293077,
            "type": "Point",
            "coordinates": [
                120.17450759,
                30.23293077
            ]
        },
        "endLocation": {
            "x": 120.16362251,
            "y": 30.26223343,
            "type": "Point",
            "coordinates": [
                120.16362251,
                30.26223343
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb98533210396796",
        "startStation": "政苑公交站",
        "endStation": "天目山路学院路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.10160454,
            "y": 30.29969299,
            "type": "Point",
            "coordinates": [
                120.10160454,
                30.29969299
            ]
        },
        "endLocation": {
            "x": 120.12924195,
            "y": 30.27178591,
            "type": "Point",
            "coordinates": [
                120.12924195,
                30.27178591
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103967b0",
        "startStation": "汽车北站",
        "endStation": "湖墅路沈塘桥",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.1125544,
            "y": 30.3180334,
            "type": "Point",
            "coordinates": [
                120.1125544,
                30.3180334
            ]
        },
        "endLocation": {
            "x": 120.15364279,
            "y": 30.28170289,
            "type": "Point",
            "coordinates": [
                120.15364279,
                30.28170289
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103967ba",
        "startStation": "翠苑四区",
        "endStation": "中北桥南",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.11944149,
            "y": 30.28732597,
            "type": "Point",
            "coordinates": [
                120.11944149,
                30.28732597
            ]
        },
        "endLocation": {
            "x": 120.16682402,
            "y": 30.27386863,
            "type": "Point",
            "coordinates": [
                120.16682402,
                30.27386863
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103967d8",
        "startStation": "蒋村公交中心站",
        "endStation": "庆春广场南",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.09134895,
            "y": 30.28679853,
            "type": "Point",
            "coordinates": [
                120.09134895,
                30.28679853
            ]
        },
        "endLocation": {
            "x": 120.2039348,
            "y": 30.26045997,
            "type": "Point",
            "coordinates": [
                120.2039348,
                30.26045997
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103967e5",
        "startStation": "下沙高教东区",
        "endStation": "金色蓝庭公交站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.38871732,
            "y": 30.3191027,
            "type": "Point",
            "coordinates": [
                120.38871732,
                30.3191027
            ]
        },
        "endLocation": {
            "x": 120.11575743,
            "y": 30.28930843,
            "type": "Point",
            "coordinates": [
                120.11575743,
                30.28930843
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103967f2",
        "startStation": "花园西村",
        "endStation": "府苑新村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.12828485,
            "y": 30.282848,
            "type": "Point",
            "coordinates": [
                120.12828485,
                30.282848
            ]
        },
        "endLocation": {
            "x": 120.09758433,
            "y": 30.2644087,
            "type": "Point",
            "coordinates": [
                120.09758433,
                30.2644087
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb98533210396842",
        "startStation": "采荷新村",
        "endStation": "武林小广场",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.20056315,
            "y": 30.25171474,
            "type": "Point",
            "coordinates": [
                120.20056315,
                30.25171474
            ]
        },
        "endLocation": {
            "x": 120.15831866,
            "y": 30.27089375,
            "type": "Point",
            "coordinates": [
                120.15831866,
                30.27089375
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb9853321039686e",
        "startStation": "和睦新村东",
        "endStation": "城站火车站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.1220189,
            "y": 30.30857656,
            "type": "Point",
            "coordinates": [
                120.1220189,
                30.30857656
            ]
        },
        "endLocation": {
            "x": 120.18591489,
            "y": 30.25002061,
            "type": "Point",
            "coordinates": [
                120.18591489,
                30.25002061
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb98533210396895",
        "startStation": "文一西路毛家桥路口",
        "endStation": "花园岗街小河路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.11827338,
            "y": 30.28734674,
            "type": "Point",
            "coordinates": [
                120.11827338,
                30.28734674
            ]
        },
        "endLocation": {
            "x": 120.1342759,
            "y": 30.32789689,
            "type": "Point",
            "coordinates": [
                120.1342759,
                30.32789689
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103968ac",
        "startStation": "益乐新村",
        "endStation": "六公园",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.11256177,
            "y": 30.28732971,
            "type": "Point",
            "coordinates": [
                120.11256177,
                30.28732971
            ]
        },
        "endLocation": {
            "x": 120.16117939,
            "y": 30.25903757,
            "type": "Point",
            "coordinates": [
                120.16117939,
                30.25903757
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103968c7",
        "startStation": "东方通信大厦",
        "endStation": "胜利剧院",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.12822446,
            "y": 30.27686745,
            "type": "Point",
            "coordinates": [
                120.12822446,
                30.27686745
            ]
        },
        "endLocation": {
            "x": 120.1641106,
            "y": 30.25657204,
            "type": "Point",
            "coordinates": [
                120.1641106,
                30.25657204
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103968d0",
        "startStation": "吉鸿家园",
        "endStation": "学院路黄姑山",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.07000801,
            "y": 30.34367457,
            "type": "Point",
            "coordinates": [
                120.07000801,
                30.34367457
            ]
        },
        "endLocation": {
            "x": 120.13019031,
            "y": 30.27557528,
            "type": "Point",
            "coordinates": [
                120.13019031,
                30.27557528
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103968dd",
        "startStation": "留下北",
        "endStation": "武林门北",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.04859177,
            "y": 30.24159264,
            "type": "Point",
            "coordinates": [
                120.04859177,
                30.24159264
            ]
        },
        "endLocation": {
            "x": 120.15959529,
            "y": 30.27458185,
            "type": "Point",
            "coordinates": [
                120.15959529,
                30.27458185
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb985332103968de",
        "startStation": "古荡新村",
        "endStation": "文一西路花蒋路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.11788306,
            "y": 30.27630584,
            "type": "Point",
            "coordinates": [
                120.11788306,
                30.27630584
            ]
        },
        "endLocation": {
            "x": 120.06862198,
            "y": 30.28661508,
            "type": "Point",
            "coordinates": [
                120.06862198,
                30.28661508
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb9853321039693a",
        "startStation": "萍水西街竞舟北路口",
        "endStation": "九莲新村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.10118491,
            "y": 30.30010301,
            "type": "Point",
            "coordinates": [
                120.10118491,
                30.30010301
            ]
        },
        "endLocation": {
            "x": 120.13420174,
            "y": 30.27711088,
            "type": "Point",
            "coordinates": [
                120.13420174,
                30.27711088
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb9853321039693d",
        "startStation": "文三西路西",
        "endStation": "东方通信大厦",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.09100804,
            "y": 30.27505714,
            "type": "Point",
            "coordinates": [
                120.09100804,
                30.27505714
            ]
        },
        "endLocation": {
            "x": 120.12819449,
            "y": 30.27653745,
            "type": "Point",
            "coordinates": [
                120.12819449,
                30.27653745
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb98533210396952",
        "startStation": "润达花园",
        "endStation": "丰登街拱苑路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.09178188,
            "y": 30.32254309,
            "type": "Point",
            "coordinates": [
                120.09178188,
                30.32254309
            ]
        },
        "endLocation": {
            "x": 120.10980617,
            "y": 30.29787185,
            "type": "Point",
            "coordinates": [
                120.10980617,
                30.29787185
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594b79a7eb9853321039695d",
        "startStation": "铭雅苑",
        "endStation": "和睦新村",
        "firstMiddleStation": "池华街公交站",
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.08291385,
            "y": 30.33862914,
            "type": "Point",
            "coordinates": [
                120.08291385,
                30.33862914
            ]
        },
        "endLocation": {
            "x": 120.120861,
            "y": 30.30956756,
            "type": "Point",
            "coordinates": [
                120.120861,
                30.30956756
            ]
        },
        "firstMiddleLocation": {
            "x": 120.07442011,
            "y": 30.33223893,
            "type": "Point",
            "coordinates": [
                120.07442011,
                30.33223893
            ]
        },
        "secondMiddleLocation": null,
        "num": 2
    }
]

/*
  *Map component creates a container for map
  *container size is controlled by css styles
  *initialise Amap as soon as Map component is mounted in react lifecycle
*/
export default class OriginDestinationSummary extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
  };
  
  dataTransformation() {
    this.data = [];
    
    data.forEach((currentRoute) => {
      this.data.push([[currentRoute.startLocation.x, currentRoute.startLocation.y], [currentRoute.endLocation.x, currentRoute.endLocation.y]]);
    });
    
    return this.data;
  };
  
  componentDidMount() {
    let palette;
    
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 16,
      center: [120.131537, 30.281016],
      animateEnable: false,
    });
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
    this.dataTransformation();
    
    palette = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: this.data,
      realtime: true,
    });
    
    this.mavas.draw();
  };
  
  render() {
    return (
      <div>
        <h1>Bus Ticket Summary</h1>
        <div className="map-container" id="map"></div>
      </div>
    );
  };
};