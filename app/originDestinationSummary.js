import React from 'react';
import echarts from 'echarts';

import Mavas from '../lib/mavas/main';
import Util from '../lib/mavas/util';

let mockData = [
    {
        "id": "594bae87eb98535d8ccf5451",
        "startStation": "汽车北站",
        "endStation": "湖州街上塘路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.113452,
            "y": 30.319135,
            "type": "Point",
            "coordinates": [
                120.113452,
                30.319135
            ]
        },
        "endLocation": {
            "x": 120.147469,
            "y": 30.324821,
            "type": "Point",
            "coordinates": [
                120.147469,
                30.324821
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 4
    },
    {
        "id": "594bae87eb98535d8ccf54f4",
        "startStation": "西溪竞舟苑",
        "endStation": "节能公司",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.05797,
            "y": 30.282631,
            "type": "Point",
            "coordinates": [
                120.05797,
                30.282631
            ]
        },
        "endLocation": {
            "x": 120.121433,
            "y": 30.282359,
            "type": "Point",
            "coordinates": [
                120.121433,
                30.282359
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 4
    },
    {
        "id": "594bae87eb98535d8ccf52f7",
        "startStation": "下沙高教东区",
        "endStation": "金色蓝庭公交站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.388722,
            "y": 30.319027,
            "type": "Point",
            "coordinates": [
                120.388722,
                30.319027
            ]
        },
        "endLocation": {
            "x": 120.115545,
            "y": 30.288843,
            "type": "Point",
            "coordinates": [
                120.115545,
                30.288843
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf5405",
        "startStation": "萍水西街竞舟北路口",
        "endStation": "九莲新村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.100743,
            "y": 30.300265,
            "type": "Point",
            "coordinates": [
                120.100743,
                30.300265
            ]
        },
        "endLocation": {
            "x": 120.1325,
            "y": 30.276965,
            "type": "Point",
            "coordinates": [
                120.1325,
                30.276965
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf5411",
        "startStation": "青蓝科创园",
        "endStation": "黄龙公交站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.0643,
            "y": 30.32611,
            "type": "Point",
            "coordinates": [
                120.0643,
                30.32611
            ]
        },
        "endLocation": {
            "x": 120.137868,
            "y": 30.270329,
            "type": "Point",
            "coordinates": [
                120.137868,
                30.270329
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf547b",
        "startStation": "翠苑四区",
        "endStation": "中北桥南",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.11948,
            "y": 30.28726,
            "type": "Point",
            "coordinates": [
                120.11948,
                30.28726
            ]
        },
        "endLocation": {
            "x": 120.167222,
            "y": 30.273664,
            "type": "Point",
            "coordinates": [
                120.167222,
                30.273664
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf5499",
        "startStation": "陆板桥",
        "endStation": "黄龙公交站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.0617,
            "y": 30.321827,
            "type": "Point",
            "coordinates": [
                120.0617,
                30.321827
            ]
        },
        "endLocation": {
            "x": 120.137868,
            "y": 30.270329,
            "type": "Point",
            "coordinates": [
                120.137868,
                30.270329
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf549f",
        "startStation": "蒋村公交中心站",
        "endStation": "教工路花园亭",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.089888,
            "y": 30.286582,
            "type": "Point",
            "coordinates": [
                120.089888,
                30.286582
            ]
        },
        "endLocation": {
            "x": 120.136258,
            "y": 30.274013,
            "type": "Point",
            "coordinates": [
                120.136258,
                30.274013
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf54f5",
        "startStation": "西溪竞舟苑",
        "endStation": "花园西村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.05797,
            "y": 30.282631,
            "type": "Point",
            "coordinates": [
                120.05797,
                30.282631
            ]
        },
        "endLocation": {
            "x": 120.128046,
            "y": 30.28267,
            "type": "Point",
            "coordinates": [
                120.128046,
                30.28267
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf5519",
        "startStation": "和睦新村东",
        "endStation": "城站火车站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.12668,
            "y": 30.308387,
            "type": "Point",
            "coordinates": [
                120.12668,
                30.308387
            ]
        },
        "endLocation": {
            "x": 120.183522,
            "y": 30.245954,
            "type": "Point",
            "coordinates": [
                120.183522,
                30.245954
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf5532",
        "startStation": "小车桥",
        "endStation": "汽车西站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.159746,
            "y": 30.258203,
            "type": "Point",
            "coordinates": [
                120.159746,
                30.258203
            ]
        },
        "endLocation": {
            "x": 120.092532,
            "y": 30.262666,
            "type": "Point",
            "coordinates": [
                120.092532,
                30.262666
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf555a",
        "startStation": "西溪竞舟苑",
        "endStation": "新河坝巷",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.05797,
            "y": 30.282631,
            "type": "Point",
            "coordinates": [
                120.05797,
                30.282631
            ]
        },
        "endLocation": {
            "x": 120.149602,
            "y": 30.284293,
            "type": "Point",
            "coordinates": [
                120.149602,
                30.284293
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf5596",
        "startStation": "望月社区",
        "endStation": "浙大附中",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.09085,
            "y": 30.313861,
            "type": "Point",
            "coordinates": [
                120.09085,
                30.313861
            ]
        },
        "endLocation": {
            "x": 120.131872,
            "y": 30.260601,
            "type": "Point",
            "coordinates": [
                120.131872,
                30.260601
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 3
    },
    {
        "id": "594bae87eb98535d8ccf529b",
        "startStation": "蒋村公交中心站",
        "endStation": "丰登街拱苑路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.089008,
            "y": 30.286688,
            "type": "Point",
            "coordinates": [
                120.089008,
                30.286688
            ]
        },
        "endLocation": {
            "x": 120.10927461,
            "y": 30.29803378,
            "type": "Point",
            "coordinates": [
                120.10927461,
                30.29803378
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52a2",
        "startStation": "九堡",
        "endStation": "章家桥",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.270838,
            "y": 30.318603,
            "type": "Point",
            "coordinates": [
                120.270838,
                30.318603
            ]
        },
        "endLocation": {
            "x": 120.179813,
            "y": 30.249026,
            "type": "Point",
            "coordinates": [
                120.179813,
                30.249026
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52aa",
        "startStation": "文三西路西",
        "endStation": "上宁桥",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.091262,
            "y": 30.275145,
            "type": "Point",
            "coordinates": [
                120.091262,
                30.275145
            ]
        },
        "endLocation": {
            "x": 120.137623,
            "y": 30.27725,
            "type": "Point",
            "coordinates": [
                120.137623,
                30.27725
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52b0",
        "startStation": "文三西路西",
        "endStation": "武林门",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.091262,
            "y": 30.275145,
            "type": "Point",
            "coordinates": [
                120.091262,
                30.275145
            ]
        },
        "endLocation": {
            "x": 120.156387,
            "y": 30.270769,
            "type": "Point",
            "coordinates": [
                120.156387,
                30.270769
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52b1",
        "startStation": "文三西路西",
        "endStation": "文三路马塍路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.091262,
            "y": 30.275145,
            "type": "Point",
            "coordinates": [
                120.091262,
                30.275145
            ]
        },
        "endLocation": {
            "x": 120.146059,
            "y": 30.277712,
            "type": "Point",
            "coordinates": [
                120.146059,
                30.277712
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52b5",
        "startStation": "政苑公交站",
        "endStation": "天目山路学院路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.10161,
            "y": 30.299503,
            "type": "Point",
            "coordinates": [
                120.10161,
                30.299503
            ]
        },
        "endLocation": {
            "x": 120.128928,
            "y": 30.271847,
            "type": "Point",
            "coordinates": [
                120.128928,
                30.271847
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52c4",
        "startStation": "丁桥公交站",
        "endStation": "万事利丝绸汇",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.2388,
            "y": 30.354945,
            "type": "Point",
            "coordinates": [
                120.2388,
                30.354945
            ]
        },
        "endLocation": {
            "x": 120.201613,
            "y": 30.28693,
            "type": "Point",
            "coordinates": [
                120.201613,
                30.28693
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52c9",
        "startStation": "汽车北站",
        "endStation": "湖墅路沈塘桥",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.113452,
            "y": 30.319135,
            "type": "Point",
            "coordinates": [
                120.113452,
                30.319135
            ]
        },
        "endLocation": {
            "x": 120.153574,
            "y": 30.281687,
            "type": "Point",
            "coordinates": [
                120.153574,
                30.281687
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52ea",
        "startStation": "蒋村公交中心站",
        "endStation": "庆春广场南",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.090917,
            "y": 30.286967,
            "type": "Point",
            "coordinates": [
                120.090917,
                30.286967
            ]
        },
        "endLocation": {
            "x": 120.20528,
            "y": 30.257701,
            "type": "Point",
            "coordinates": [
                120.20528,
                30.257701
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52f1",
        "startStation": "梦想小镇公交站",
        "endStation": "骆家庄",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.003549,
            "y": 30.294414,
            "type": "Point",
            "coordinates": [
                120.003549,
                30.294414
            ]
        },
        "endLocation": {
            "x": 120.100552,
            "y": 30.286628,
            "type": "Point",
            "coordinates": [
                120.100552,
                30.286628
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf52f8",
        "startStation": "蒋村公交中心站",
        "endStation": "教工路花园亭",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.089888,
            "y": 30.286582,
            "type": "Point",
            "coordinates": [
                120.089888,
                30.286582
            ]
        },
        "endLocation": {
            "x": 120.13625,
            "y": 30.275835,
            "type": "Point",
            "coordinates": [
                120.13625,
                30.275835
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5307",
        "startStation": "花园西村",
        "endStation": "府苑新村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.128046,
            "y": 30.28267,
            "type": "Point",
            "coordinates": [
                120.128046,
                30.28267
            ]
        },
        "endLocation": {
            "x": 120.09678,
            "y": 30.266902,
            "type": "Point",
            "coordinates": [
                120.09678,
                30.266902
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5353",
        "startStation": "玉古路天目山路口",
        "endStation": "少年宫",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.129117,
            "y": 30.26879,
            "type": "Point",
            "coordinates": [
                120.129117,
                30.26879
            ]
        },
        "endLocation": {
            "x": 120.156197,
            "y": 30.260647,
            "type": "Point",
            "coordinates": [
                120.156197,
                30.260647
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5363",
        "startStation": "机动车辆管理所",
        "endStation": "青蓝科创园",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.097145,
            "y": 30.305847,
            "type": "Point",
            "coordinates": [
                120.097145,
                30.305847
            ]
        },
        "endLocation": {
            "x": 120.0643,
            "y": 30.32611,
            "type": "Point",
            "coordinates": [
                120.0643,
                30.32611
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf537b",
        "startStation": "文一西路毛家桥路口",
        "endStation": "花园岗街小河路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.117306,
            "y": 30.287353,
            "type": "Point",
            "coordinates": [
                120.117306,
                30.287353
            ]
        },
        "endLocation": {
            "x": 120.134683,
            "y": 30.327931,
            "type": "Point",
            "coordinates": [
                120.134683,
                30.327931
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf53a9",
        "startStation": "东方通信大厦",
        "endStation": "胜利剧院",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.12845,
            "y": 30.276724,
            "type": "Point",
            "coordinates": [
                120.12845,
                30.276724
            ]
        },
        "endLocation": {
            "x": 120.164024,
            "y": 30.256442,
            "type": "Point",
            "coordinates": [
                120.164024,
                30.256442
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf53b0",
        "startStation": "吉鸿家园",
        "endStation": "学院路黄姑山",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.069796,
            "y": 30.343828,
            "type": "Point",
            "coordinates": [
                120.069796,
                30.343828
            ]
        },
        "endLocation": {
            "x": 120.13012,
            "y": 30.275291,
            "type": "Point",
            "coordinates": [
                120.13012,
                30.275291
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf53b5",
        "startStation": "浙大紫金港校区",
        "endStation": "联桥",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.093012,
            "y": 30.305312,
            "type": "Point",
            "coordinates": [
                120.093012,
                30.305312
            ]
        },
        "endLocation": {
            "x": 120.17146,
            "y": 30.256706,
            "type": "Point",
            "coordinates": [
                120.17146,
                30.256706
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf53c9",
        "startStation": "青蓝科创园",
        "endStation": "黄龙公交站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.06422,
            "y": 30.326115,
            "type": "Point",
            "coordinates": [
                120.06422,
                30.326115
            ]
        },
        "endLocation": {
            "x": 120.137868,
            "y": 30.270329,
            "type": "Point",
            "coordinates": [
                120.137868,
                30.270329
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf53ef",
        "startStation": "政苑小区",
        "endStation": "黄龙洞",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.10604,
            "y": 30.295979,
            "type": "Point",
            "coordinates": [
                120.10604,
                30.295979
            ]
        },
        "endLocation": {
            "x": 120.139218,
            "y": 30.265044,
            "type": "Point",
            "coordinates": [
                120.139218,
                30.265044
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5407",
        "startStation": "文三西路西",
        "endStation": "东方通信大厦",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.091262,
            "y": 30.275145,
            "type": "Point",
            "coordinates": [
                120.091262,
                30.275145
            ]
        },
        "endLocation": {
            "x": 120.12845,
            "y": 30.276724,
            "type": "Point",
            "coordinates": [
                120.12845,
                30.276724
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5419",
        "startStation": "汽车北站",
        "endStation": "绍兴路香积寺路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.113452,
            "y": 30.319135,
            "type": "Point",
            "coordinates": [
                120.113452,
                30.319135
            ]
        },
        "endLocation": {
            "x": 120.160189,
            "y": 30.306655,
            "type": "Point",
            "coordinates": [
                120.160189,
                30.306655
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5420",
        "startStation": "文三西路西",
        "endStation": "市三医院北",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.091262,
            "y": 30.275145,
            "type": "Point",
            "coordinates": [
                120.091262,
                30.275145
            ]
        },
        "endLocation": {
            "x": 120.177021,
            "y": 30.24725,
            "type": "Point",
            "coordinates": [
                120.177021,
                30.24725
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5434",
        "startStation": "建兰中学",
        "endStation": "孩儿巷",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.174446,
            "y": 30.232528,
            "type": "Point",
            "coordinates": [
                120.174446,
                30.232528
            ]
        },
        "endLocation": {
            "x": 120.163769,
            "y": 30.262349,
            "type": "Point",
            "coordinates": [
                120.163769,
                30.262349
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5437",
        "startStation": "萍水街丰潭路口",
        "endStation": "黄龙公交站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.10704,
            "y": 30.300405,
            "type": "Point",
            "coordinates": [
                120.10704,
                30.300405
            ]
        },
        "endLocation": {
            "x": 120.137868,
            "y": 30.270329,
            "type": "Point",
            "coordinates": [
                120.137868,
                30.270329
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5467",
        "startStation": "池华街公交站",
        "endStation": "市府大楼",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.072988,
            "y": 30.330984,
            "type": "Point",
            "coordinates": [
                120.072988,
                30.330984
            ]
        },
        "endLocation": {
            "x": 120.156041,
            "y": 30.272932,
            "type": "Point",
            "coordinates": [
                120.156041,
                30.272932
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf546e",
        "startStation": "景芳南站",
        "endStation": "延安新村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.208595,
            "y": 30.26517,
            "type": "Point",
            "coordinates": [
                120.208595,
                30.26517
            ]
        },
        "endLocation": {
            "x": 120.163448,
            "y": 30.267118,
            "type": "Point",
            "coordinates": [
                120.163448,
                30.267118
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5474",
        "startStation": "建兰中学",
        "endStation": "市三医院北",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.174215,
            "y": 30.231906,
            "type": "Point",
            "coordinates": [
                120.174215,
                30.231906
            ]
        },
        "endLocation": {
            "x": 120.177021,
            "y": 30.24725,
            "type": "Point",
            "coordinates": [
                120.177021,
                30.24725
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf548e",
        "startStation": "陆板桥",
        "endStation": "九莲新村",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.0617,
            "y": 30.321827,
            "type": "Point",
            "coordinates": [
                120.0617,
                30.321827
            ]
        },
        "endLocation": {
            "x": 120.1325,
            "y": 30.276965,
            "type": "Point",
            "coordinates": [
                120.1325,
                30.276965
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf54a6",
        "startStation": "古荡新村",
        "endStation": "八字桥",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.117393,
            "y": 30.276308,
            "type": "Point",
            "coordinates": [
                120.117393,
                30.276308
            ]
        },
        "endLocation": {
            "x": 120.148041,
            "y": 30.272135,
            "type": "Point",
            "coordinates": [
                120.148041,
                30.272135
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf54ec",
        "startStation": "花园西村",
        "endStation": "浣纱路国货路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.128046,
            "y": 30.28267,
            "type": "Point",
            "coordinates": [
                120.128046,
                30.28267
            ]
        },
        "endLocation": {
            "x": 120.16632,
            "y": 30.24948,
            "type": "Point",
            "coordinates": [
                120.16632,
                30.24948
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf552d",
        "startStation": "水碧苑",
        "endStation": "石灰坝",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.0912,
            "y": 30.327246,
            "type": "Point",
            "coordinates": [
                120.0912,
                30.327246
            ]
        },
        "endLocation": {
            "x": 120.162193,
            "y": 30.291659,
            "type": "Point",
            "coordinates": [
                120.162193,
                30.291659
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf554b",
        "startStation": "益乐新村",
        "endStation": "六公园",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.112646,
            "y": 30.287074,
            "type": "Point",
            "coordinates": [
                120.112646,
                30.287074
            ]
        },
        "endLocation": {
            "x": 120.161072,
            "y": 30.258971,
            "type": "Point",
            "coordinates": [
                120.161072,
                30.258971
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf555f",
        "startStation": "丁桥公交站",
        "endStation": "城站火车站",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.2388,
            "y": 30.354945,
            "type": "Point",
            "coordinates": [
                120.2388,
                30.354945
            ]
        },
        "endLocation": {
            "x": 120.183522,
            "y": 30.245954,
            "type": "Point",
            "coordinates": [
                120.183522,
                30.245954
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5569",
        "startStation": "文二路马塍路口",
        "endStation": "花蒋路紫霞街口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.145751,
            "y": 30.283601,
            "type": "Point",
            "coordinates": [
                120.145751,
                30.283601
            ]
        },
        "endLocation": {
            "x": 120.0696,
            "y": 30.288475,
            "type": "Point",
            "coordinates": [
                120.0696,
                30.288475
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf5579",
        "startStation": "留下北",
        "endStation": "武林门北",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.053468,
            "y": 30.245776,
            "type": "Point",
            "coordinates": [
                120.053468,
                30.245776
            ]
        },
        "endLocation": {
            "x": 120.158905,
            "y": 30.275112,
            "type": "Point",
            "coordinates": [
                120.158905,
                30.275112
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf558b",
        "startStation": "文二西路竞舟路口",
        "endStation": "文二路马塍路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.105984,
            "y": 30.281755,
            "type": "Point",
            "coordinates": [
                120.105984,
                30.281755
            ]
        },
        "endLocation": {
            "x": 120.145751,
            "y": 30.283601,
            "type": "Point",
            "coordinates": [
                120.145751,
                30.283601
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55bb",
        "startStation": "林家浜路",
        "endStation": "青蓝科创园",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.128673,
            "y": 30.293682,
            "type": "Point",
            "coordinates": [
                120.128673,
                30.293682
            ]
        },
        "endLocation": {
            "x": 120.0643,
            "y": 30.32611,
            "type": "Point",
            "coordinates": [
                120.0643,
                30.32611
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55bc",
        "startStation": "雅仕苑",
        "endStation": "海洋二所",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.105938,
            "y": 30.286862,
            "type": "Point",
            "coordinates": [
                120.105938,
                30.286862
            ]
        },
        "endLocation": {
            "x": 120.140349,
            "y": 30.279479,
            "type": "Point",
            "coordinates": [
                120.140349,
                30.279479
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55bd",
        "startStation": "文化商城",
        "endStation": "浙大紫金港校区",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.118459,
            "y": 30.296218,
            "type": "Point",
            "coordinates": [
                120.118459,
                30.296218
            ]
        },
        "endLocation": {
            "x": 120.093012,
            "y": 30.305312,
            "type": "Point",
            "coordinates": [
                120.093012,
                30.305312
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55be",
        "startStation": "吉鸿家园",
        "endStation": "水涟苑",
        "firstMiddleStation": "吉鸿家园",
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.069796,
            "y": 30.343828,
            "type": "Point",
            "coordinates": [
                120.069796,
                30.343828
            ]
        },
        "endLocation": {
            "x": 120.095438,
            "y": 30.331221,
            "type": "Point",
            "coordinates": [
                120.095438,
                30.331221
            ]
        },
        "firstMiddleLocation": {
            "x": 120.069796,
            "y": 30.343828,
            "type": "Point",
            "coordinates": [
                120.069796,
                30.343828
            ]
        },
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55c4",
        "startStation": "雅仕苑",
        "endStation": "省委党校仓前校区",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.106492,
            "y": 30.286764,
            "type": "Point",
            "coordinates": [
                120.106492,
                30.286764
            ]
        },
        "endLocation": {
            "x": 120.013298,
            "y": 30.278155,
            "type": "Point",
            "coordinates": [
                120.013298,
                30.278155
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55cc",
        "startStation": "计家湾东",
        "endStation": "黄龙体育中心",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.0485,
            "y": 30.282005,
            "type": "Point",
            "coordinates": [
                120.0485,
                30.282005
            ]
        },
        "endLocation": {
            "x": 120.136992,
            "y": 30.266462,
            "type": "Point",
            "coordinates": [
                120.136992,
                30.266462
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55ec",
        "startStation": "润达花园",
        "endStation": "丰登街拱苑路口",
        "firstMiddleStation": null,
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.090658,
            "y": 30.325517,
            "type": "Point",
            "coordinates": [
                120.090658,
                30.325517
            ]
        },
        "endLocation": {
            "x": 120.110725,
            "y": 30.298279,
            "type": "Point",
            "coordinates": [
                120.110725,
                30.298279
            ]
        },
        "firstMiddleLocation": null,
        "secondMiddleLocation": null,
        "num": 2
    },
    {
        "id": "594bae87eb98535d8ccf55f2",
        "startStation": "铭雅苑",
        "endStation": "方家塘换乘站",
        "firstMiddleStation": "池华街公交站",
        "secondMiddleStation": null,
        "startLocation": {
            "x": 120.08456,
            "y": 30.337762,
            "type": "Point",
            "coordinates": [
                120.08456,
                30.337762
            ]
        },
        "endLocation": {
            "x": 120.118097,
            "y": 30.31147,
            "type": "Point",
            "coordinates": [
                120.118097,
                30.31147
            ]
        },
        "firstMiddleLocation": {
            "x": 120.072988,
            "y": 30.330984,
            "type": "Point",
            "coordinates": [
                120.072988,
                30.330984
            ]
        },
        "secondMiddleLocation": null,
        "num": 2
    }
];

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
  
  componentDidMount() {
    //init mavas; see amap api reference
    this.mavas = new Mavas('map',{
      resizeEnable: true,
      zoom: 16,
      center: [120.131537, 30.281016],
      animateEnable: false,
    });
    //init amap layers on demand; see amap api reference
    this.mavas.map.plugin(['AMap.CustomLayer'], () => {});
    
    var request = new XMLHttpRequest();
    request.open('GET', 'http://10.88.1.227:8080/od', true);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    request.send();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200){
        mockData = JSON.parse(request.response);
        console.log('draw');
        this.draw();
      };
    };
  };
  
  draw() {
    let palette, polylinePalette, markerPalette, tooltipPalette;
    
    this.dataTransformation();
    
    polylinePalette = this.mavas.createLayer({
      type: 'polyline',
      id: 'polyline',
      data: this.data,
      realtime: true,
      color: 'red',
    });
    
    palette = this.mavas.createLayer({
      type: 'marker',
      id: 'marker',
      data: (() => {
        let result = [];
        
        this.data.forEach((currentLine) => {
          result.push(currentLine[0]);
          result.push(currentLine[1]);
        });
        
        return result;
      })(),
      tooltip: (() => {
        let result = [];
        
        let startStation = Util.pluck(mockData, 'startStation');
        let endStation = Util.pluck(mockData, 'endStation');
        let num = Util.pluck(mockData, 'num');
        
        for(let i = 0, len = startStation.length; i < len; i++) {
          result.push(`起始站：${startStation[i]}，人数：${num[i]}`);
          result.push(`终点站：${endStation[i]}，人数：${num[i]}`);
        };
        
        return result;
      })(),
    });
    
    markerPalette = palette.palette;
    tooltipPalette = palette.paletteTooltip;
    
    this.mavas.draw({
      zIndex: 150,
    });
  };
  
  dataTransformation() {
    this.data = [];
    
    mockData.forEach((currentRoute) => {
      this.data.push([[currentRoute.startLocation.x, currentRoute.startLocation.y], [currentRoute.endLocation.x, currentRoute.endLocation.y]]);
    });
    
    return this.data;
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