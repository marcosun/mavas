# Mavas

*** build your canvas on amap ***

> # Polyline

> ## createLayer

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
| &nbsp;&nbsp;&nbsp;&nbsp;isRealtime                       | Object   | O                   | false       | 是否在托拉拽的时候实时重绘     |
| ** lineStyle **                                          | Object   | O                   |             | 全部线的样式                |
| &nbsp;&nbsp;&nbsp;&nbsp;type                             | Sring    | O                   | line        | 直线 -> line 虚线 -> dash   |
| &nbsp;&nbsp;&nbsp;&nbsp;lineWidth                        | Number   | O                   | 1           | 线的粗细，用数字表示宽度px    |
| &nbsp;&nbsp;&nbsp;&nbsp;color                            | Sring    | O                   | black       | 颜色                       |
| ** data **                                               | [Object] | O                   |             | 每一条线一个Array i.e. [{coords: [[10.123, 10.123], [10.456, 10.456], [10.789, 10.789]]}] 表示一条线经过三个坐标点 |
| &nbsp;&nbsp;&nbsp;&nbsp;coords                           | Array    | O                   | []          | 线的坐标点                  |
| &nbsp;&nbsp;&nbsp;&nbsp;lineStyle                        | Object   | O                   |             | 针对这条线的样式，优先级高于全部线样式 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type     | Sring    | O                   | line        | 直线 -> line 虚线 -> dash   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lineWidth | Number  | O                   | 1           | 线的粗细，用数字表示宽度px    |
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
    lineWidth: 5,
    color: '#00FFFF',
  },
});

//4. 渲染自定义图层
mavas.draw();

```

> ## updatePalette

更新图层，只有data对象可以更新

** config **

参考createLayer的参数

``` javascript
//更新图层
polylinePalette.updatePalette({
  type: 'polyline',
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

//强制刷新 此处必须
polylinePalette.draw(true);

```

> # Marker

> ## createLayer

创建图层

** config **

| name                                                     | Type     | Compulsory/Optional | Default     | Description              |
| :------------------------------------------------------- | :-----   | :------------------ | :---------- | :----------------------- |
| ** type **                                               | String   | C                   |             | 标记做图类型，标记:marker   |
| ** id **                                                 | String   | O                   |             | html canvas id           |
| ** algo **                                               | Object   | O                   |             | 做图算法                  |
| &nbsp;&nbsp;&nbsp;&nbsp;isRealtime                       | Object   | O                   | false       | 是否在托拉拽的时候实时重绘   |
| ** onClick **                                            | Function | O                   |             | 点击标记后的回调 (e) => {}  |
| ** data **                                               | [Object] | O                   |             | [{coords: [10.123, 10.123]}, {coords: [10.456, 10.456]}] 表示标记此坐标 |
| &nbsp;&nbsp;&nbsp;&nbsp;coords                           | Array    | O                   | []          | 坐标点                    |
| &nbsp;&nbsp;&nbsp;&nbsp;icon                             | [Image]  | O                   | 蓝色气泡带自增id | 接受Image标签、Canvas；默认id自增的蓝色气泡 |
| &nbsp;&nbsp;&nbsp;&nbsp;offsetX                          | Number   | O                   | 0           | icon中心与坐标的横向偏移量, 右侧为正 |
| &nbsp;&nbsp;&nbsp;&nbsp;offsetY                          | Number   | O                   | 0           | icon中心与坐标的纵向偏移量, 上方为正 |

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

参考createLayer的参数

``` javascript
//更新图层
markerPalette.updatePalette({
  type: 'marker',
  data: [{
    coords: [120.26405,30.354651],
  }, {
    coords: [120.27405,30.364651],
  }, {
    coords: [120.28405,30.374651],
  }],
});

//强制刷新 此处必须
markerPalette.draw(true);

```

> # InfoWindow

> ## createLayer

创建图层

** config **

| name                                                     | Type     | Compulsory/Optional | Default     | Description              |
| :------------------------------------------------------- | :-----   | :------------------ | :---------- | :----------------------- |
| ** type **                                               | String   | C                   |             | 标记做图类型，信息窗体:infoWindow |
| ** id **                                                 | String   | O                   |             | html canvas id           |
| ** data **                                               | [Object] | O                   |             | [{coords: [120.057926, 30.183576], offset: [-80, 20], desc: '凤起路站'}] 表示标记此坐标 |
| &nbsp;&nbsp;&nbsp;&nbsp;coords                           | Array    | O                   | []          | 坐标点                    |
| &nbsp;&nbsp;&nbsp;&nbsp;offsetX                          | Number   | O                   | 0           | 信息窗体中心位置的偏移距离    |
| &nbsp;&nbsp;&nbsp;&nbsp;offsetY                          | Number   | O                   | 0           | 信息窗体中心位置的偏移距离    |
| &nbsp;&nbsp;&nbsp;&nbsp;content                          | String   | O                   | ''          | 信息窗题文本内容            |
| &nbsp;&nbsp;&nbsp;&nbsp;style                            | Object   | O                   |             | 样式                      |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shape    | String   | O                   | rect        | 边框类型: rect -> 矩形, roundRect -> 圆角矩形 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width    | Number   | O                   | 80          | 宽度                      |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height   | Number   | O                   | 20          | 高度                      |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;borderWidth | Number | O                  | 1           | 边框宽度                   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;borderRadius | Number | O                 | 0           | 边框弧度,仅当rect = roundRect时生效 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;borderColor | String | O                  | green       | 边框颜色                   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;font     | String   | O                   | 12px monospace | 字体                   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color    | String   | O                   | black       | 字体颜色                   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width    | Number   | O                   | 80          | 宽度                      |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backgroundColor | String | O              | white       | 背景颜色                   |

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
});

//2. 开启自定义图层
//详见http://lbs.amap.com/api/javascript-api/reference/layer#AMap.CustomLayer
mavas.map.plugin(['AMap.CustomLayer'], () => {});

//3. 创建自定义图层
const infoWindowPalette = mavas.createLayer({
  type: 'infoWindow',
  id: 'infoWindow',
  data: [{
    coords: [120.16405,30.254651],
    offsetX: -80,
    offsetY: 20,
    content: '凤起路站',
    style: {
    
    },
  }, {
    coords: [120.17405,30.264651],
    offsetX: -80,
    offsetY: 20,
    content: '龙翔桥',
  }],
});

//4. 渲染自定义图层
mavas.draw();

```

> ## updatePalette

更新图层，只有data对象可以更新

** config **

参考createLayer的参数

``` javascript
//更新图层
infoWindowPalette.updatePalette({
  type: 'infoWindow',
  data: [{
    coords: [120.16405,30.254651],
    offsetX: 80,
    offsetY: 20,
    content: '凤起路站',
  }],
});

//刷新
infoWindowPalette.draw();

```

> # Tooltip

> ## createLayer

创建图层

** config **

| name                                                     | Type     | Compulsory/Optional | Default     | Description              |
| :------------------------------------------------------- | :-----   | :------------------ | :---------- | :----------------------- |
| ** type **                                               | String   | C                   |             | 标记做图类型, tooltip      |
| ** id **                                                 | String   | O                   |             | html canvas id           |
| ** cumulative **                                         | Boolean  | O                   | false       | 是否显示覆盖区域的全部重叠tooltip |
| ** style **                                              | Object   | O                   |             | 样式                      |
| &nbsp;&nbsp;&nbsp;&nbsp;left                             | Number   | O                   | 10          | 同css left |
| &nbsp;&nbsp;&nbsp;&nbsp;width                            | Number   | O                   | 108         | 同css width              |
| &nbsp;&nbsp;&nbsp;&nbsp;padding                          | Number   | O                   | 6           | 同css padding            |
| &nbsp;&nbsp;&nbsp;&nbsp;lineHeight                       | Number   | O                   | 1.6         | 同css line-height        |
| &nbsp;&nbsp;&nbsp;&nbsp;font                             | String   | O                   | 12px monospace | 同css font; 不是font-size哦! |
| &nbsp;&nbsp;&nbsp;&nbsp;color                            | String   | O                   | white       | 同css color              |
| &nbsp;&nbsp;&nbsp;&nbsp;backgroundColor                  | String   | O                   | rgba(0, 0, 0, 0.7) | 同css background-color |
| ** data **                                               | [Object] | O                   |             | [{coords: [10.123, 10.123]}, {coords: [10.456, 10.456]}] |
| &nbsp;&nbsp;&nbsp;&nbsp;coords                           | Array    | O                   | []          | 坐标点                    |
| &nbsp;&nbsp;&nbsp;&nbsp;width                            | String   | O                   | 38          | 覆盖区域的宽度             |
| &nbsp;&nbsp;&nbsp;&nbsp;height                           | String   | O                   | 56          | 覆盖区域的高度             |
| &nbsp;&nbsp;&nbsp;&nbsp;desc                             | String   | O                   | ''          | tooltip内容               |
| &nbsp;&nbsp;&nbsp;&nbsp;offsetX                          | Number   | O                   | 0           | 覆盖区域与坐标的横向偏移量, 右侧为正 |
| &nbsp;&nbsp;&nbsp;&nbsp;offsetY                          | Number   | O                   | 0           | 覆盖区域与坐标的纵向偏移量, 上方为正 |
| &nbsp;&nbsp;&nbsp;&nbsp;style                            | Object   | O                   |             | 样式, 设置每一个tooltip的样式 |

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
});

//2. 开启自定义图层
//详见http://lbs.amap.com/api/javascript-api/reference/layer#AMap.CustomLayer
mavas.map.plugin(['AMap.CustomLayer'], () => {});

//3. 创建自定义图层
const tooltipPalette = mavas.createLayer({
  type: 'tooltip',
  id: 'tooltip',
  style: {
    left: 20,
  },
  data: [{
    coords: [120.16405,30.254651],
    width: 10,
    height: 10,
    desc: '凤起路',
  }],
});

//4. 渲染自定义图层
mavas.draw();

```

> ## updatePalette

更新图层，只有data对象可以更新

** config **

参考createLayer的参数

``` javascript
//更新图层
tooltipPalette.updatePalette({
  type: 'tooltip',
  data: [{
    coords: [120.26405,30.354651],
    width: 10,
    height: 10,
    desc: '龙翔桥',
  }],
});

//刷新
tooltipPalette.draw();

```

> # Instant Method

> ## setFit

Mavas实例化对象拥有setFit方法，可以使用这个方法来自动调整缩放级别、聚焦Polyline和Marker图层

** config **

| Type              | Compulsory/Optional | Default     | Description                                  |
| :---------------- | :------------------ | :---------- | :------------------------------------------- |
| Marker/Polyline   | C                   |             | Mavas.createLayer返回的Polyline或者Marker对象 |

``` javascript
//create Mavas instant
const mavas = new window.Mavas.default('map', {
});

//setFit on a particular palette
mavas.setFit(markerPalette);

```