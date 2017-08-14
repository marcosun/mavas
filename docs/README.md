# Mavas

*** build your canvas on amap ***

> # Polyline

> ## createPalette

创建图层

** config **

| name                                                     | Type     | Compulsory/Optional | Default     | Description              |
| :------------------------------------------------------- | :------- | :------------------ | :---------- | :----------------------- |
| ** type **                                               | String   | C                   |             | 标记做图类型，直线:polyline |
| ** id **                                                 | String   | O                   |             | html canvas id           |
| ** algo **                                               | Object   | O                   |             | 做图算法                  |
| &nbsp;&nbsp;&nbsp;&nbsp;cacheAlgo                        | String   | O                   | 9 blocks    | 计算显示屏幕范围内的图像，支持9 blocks和simple两种算法，强烈推荐默认算法 |
| &nbsp;&nbsp;&nbsp;&nbsp;delay                            | Object   | O                   |             | 大数据量下的间隔时间段批量做图 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;interval | Number   | O                   |             | 时间间隔多久ms              |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;size     | Number   | O                   |             | 每次做多少条直线             |
| &nbsp;&nbsp;&nbsp;&nbsp;isRealtime                       | Object   | O                   | true        | 是否在托拉拽的时候实时重绘     |
| ** lineStyle **                                          | Object   | O                   |             | 全部线的样式                |
| &nbsp;&nbsp;&nbsp;&nbsp;type                             | Sring    | O                   | line        | 直线 -> line 虚线 -> dash   |
| &nbsp;&nbsp;&nbsp;&nbsp;color                            | Sring    | O                   | black       | 颜色                       |
| ** data **                                               | [Object] | O                   |             | 每一条线一个Array i.e. [{coords: [[10.123, 10.123], [10.456, 10.456], [10.789, 10.789]]}] 表示一条线经过三个坐标点 |
| &nbsp;&nbsp;&nbsp;&nbsp;coords                           | Array    | O                   | []          | 线的坐标点                  |
| &nbsp;&nbsp;&nbsp;&nbsp;lineStyle                        | Object   | O                   |             | 针对这条线的样式，优先级高于全部线样式 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type     | Sring    | O                   | line        | 直线 -> line 虚线 -> dash   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color    | Sring    | O                   | black       | 颜色                       |
| &nbsp;&nbsp;&nbsp;&nbsp;symbol                           | Object   | O                   |             | 线条上增加标志               |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;symbol   | Array    | O                   | ['none', 'none'] | 不显示 -> none 箭头 -> arrow 第一个代表线段起点，第二个代表线段终点 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;size     | Array    | O                   | [10, 10]    | 大小尺寸                    |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color    | Sring    | O                   | black       | 颜色                       |

``` javascript
import Mavas from './lib/mavas';

//初始化步骤：

//1. 初始化地图层
//详见http://lbs.amap.com/api/javascript-api/reference/map
const mavas = new Mavas('map',{
  resizeEnable: true,
  zoom: 11,
  center: [120.16405,30.254651],
  animateEnable: false,
  mapStyle: 'amap://styles/darkblue',
});

//2. 开启自定义图层
//详见http://lbs.amap.com/api/javascript-api/reference/layer#AMap.CustomLayer
mavas.map.plugin(['AMap.CustomLayer'], () => {});

//3. 创建自定义图层
//createLayer支持polyline，marker
const polylinePalette = mavas.createLayer({
  type: 'polyline',
  id: 'polyline',
  data: [{
    coords: [[120.16405,30.254651], [120.17405,30.264651], [120.18405,30.274651]],
    lineStyle: {
      type: 'dash',
      color: 'blue',
    },
  },{
    coords: [[120.16405,30.264651], [120.16405,30.274651], [120.16405,30.284651]],
  }],
  algo: {
    cacheAlgo: '9 blocks',
    delay: {
      interval: 100,
      size: 100,
    },
    isRealtime: true,
  },
  lineStyle: {
    type: 'line',
    color: '#00FFFF',
  },
});

//4. 渲染自定义图层
mavas.draw();

```

> ## updatePalette

更新图层，只有data对象可以更新

** config **

参考createPalette的参数

``` javascript

polylinePalette.updatePalette({
  data: [{
    coords: [[120.26405,30.354651], [120.27405,30.364651], [120.28405,30.374651]],
    lineStyle: {
      type: 'dash',
      color: 'blue',
    },
  },{
    coords: [[120.26405,30.364651], [120.26405,30.374651], [120.26405,30.384651]],
  }],
});

polylinePalette.draw();

```

> # Marker

> ## createPalette

创建图层

** config **

| name                                                     | Type     | Compulsory/Optional | Default     | Description              |
| :------------------------------------------------------- | :-----   | :------------------ | :---------- | :----------------------- |
| ** type **                                               | String   | C                   |             | 标记做图类型，标记:marker   |
| ** id **                                                 | String   | O                   |             | html canvas id           |
| ** algo **                                               | Object   | O                   |             | 做图算法                  |
| &nbsp;&nbsp;&nbsp;&nbsp;isRealtime                       | Object   | O                   | true        | 是否在托拉拽的时候实时重绘   |
| ** onClick **                                            | Function | O                   |             | 点击标记后的回调 (e) => {}  |
| ** data **                                               | [Object] | O                   |             | [{coords: [10.123, 10.123]}, {coords: [10.456, 10.456]}] 表示标记此坐标 |
| &nbsp;&nbsp;&nbsp;&nbsp;coords                           | Array    | O                   | []          | 坐标点                    |
| &nbsp;&nbsp;&nbsp;&nbsp;icon                             | [Image]  | O                   | 蓝色气泡带自增id | 接受Image标签、Canvas；默认id自增的蓝色气泡 |

``` javascript
import Mavas from './lib/mavas';

//初始化步骤：

//1. 初始化地图层
//详见http://lbs.amap.com/api/javascript-api/reference/map
const mavas = new Mavas('map',{
  resizeEnable: true,
  zoom: 11,
  center: [120.16405,30.254651],
  animateEnable: false,
  mapStyle: 'amap://styles/darkblue',
});

//2. 开启自定义图层
//详见http://lbs.amap.com/api/javascript-api/reference/layer#AMap.CustomLayer
mavas.map.plugin(['AMap.CustomLayer'], () => {});

//3. 创建自定义图层
const markerPalette = mavas.createLayer({
  type: 'marker',
  id: 'marker',
  data: [{
    coords: [120.16405,30.254651],
  }, {
    coords: [120.17405,30.264651],
  }, {
    coords: [120.18405,30.274651],
  }],
  algo: {
    isRealtime: true,
  },
  onClick: (e) => {
    console.info(e);
  },
});

//4. 渲染自定义图层
mavas.draw();

```

> ## updatePalette

更新图层，只有data对象可以更新

** config **

参考createPalette的参数

``` javascript

markerPalette.updatePalette({
  data: [{
    coords: [120.26405,30.354651],
  }, {
    coords: [120.27405,30.364651],
  }, {
    coords: [120.28405,30.374651],
  }],
});

markerPalette.draw();

```