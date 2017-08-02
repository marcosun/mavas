import React from 'react';
import echarts from 'echarts';
import request from 'superagent';

import Util from '../lib/mavas/util';

export default class Migration extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isFetching: true,
      isError: false,
      availableDistricts: [],
    };
    
    this.mapCanvasToApi = (canvasName) => {
      const mapping = {
        migration: `${__API_ROOT__}/groupByDistrictName`,
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

    this.migration = {...this.base};
    
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
    
    this.migration = assignCanvas('migration');
    
    this.init();
  };
  
  getDistrictNameList(data) {
    const startDistricts = Util.pluck(data, 'startDistrictName'),
          endDistricts = Util.pluck(data, 'endDistrictName'),
          districts = Util.unique(startDistricts.concat(endDistricts));

    return districts;
  };
  
  initSelectBar() {
    
    this.setState({
      ...this.state,
      availableDistricts: this.getDistrictNameList(this.migration.data),
    });
    
  };
  
  draw(district) {
    const filterDataOnStartDistrict = (data, district) => {
      return Util.findAll(data, (item) => {
        return item.startDistrictName === district;
      });
    };
    
    const composeDataForEachDistrict = (data) => {
      const checkIfStartDistrictIncluded = (result, startDistrict) => {
        return result.find((item) => {
          return item.name === startDistrict;
        });
      };
      
      const startDistrict = data[0].startDistrictName,
            maxSize = Math.max.apply(null, Util.pluck(data, 'num'));
      
      let result = data.map((item, index) => {
        return {
          name: item.endDistrictName,
          value: 10, //equally distributed
          symbol: 'circle',
          symbolSize: Math.max(Math.ceil(item.num / maxSize * 100), 10),//format symbol size to max 100, min size => 10
          volume: item.num,
          category: index,
          label: {
            normal: {
              show: true,
            },
          },
        };
      });
      
      if (checkIfStartDistrictIncluded(result, startDistrict) === undefined) {
        result.push({
          name: startDistrict,
          value: 10, //equally distributed
          symbol: 'circle',
          symbolSize: 10,//format symbol size to max 100, min size => 10
          volume: 0,
          category: result.length,
          label: {
            normal: {
              show: true,
            },
          },
        });
      };
      
      return result;
    };

    const getCategories = (districts) => {
      return districts.map((district) => {
        return {
          name: district,
        };
      });
    };

    const composeLinks = (data) => {
      const maxSize = Math.max.apply(null, Util.pluck(data, 'num'));

      return data.map((item) => {
        return {
          source: item.startDistrictName,
          target: item.endDistrictName,
          symbol: ['none', 'arrow'],
          volume: item.num,
//          symbolSize: Math.max(Math.ceil(item.num / maxSize * 80), 8),
//          lineStyle: {
//            normal: {
//              width: Math.max(Math.ceil(item.num / maxSize * 30), 3),
//            },
//          },
        };
      });
    };

    const filteredData = filterDataOnStartDistrict(this.migration.data, district),
          districts = this.getDistrictNameList(filteredData),
          categories = getCategories(districts),
          data = composeDataForEachDistrict(filteredData),
          links = composeLinks(filteredData);

    this.migration.option = {
      title: {
        text: '区域人口流动',
      },
      tooltip: {
        formatter: (ticket) => {
          switch(ticket.dataType) {
            case 'node':
              return `目的地 ${ticket.data.name}<br/>${ticket.marker}${ticket.data.volume}人`;
              break;
            case 'edge':
              return `${ticket.name} ${ticket.data.volume}人`;
              break;
          };
        },
      },
      legend: [{
        data: Util.pluck(categories, 'name'),
      }],
      series: [
        {
          name:'区域人口流动',
          type:'graph',
          layout: 'circular',
          circular: {
            rotateLabel: true,
          },
          categories: categories,
          data: data,
          links: links,
          label: {
            normal: {
              position: 'right',
              formatter: '{b}'
            }
          },
          lineStyle: {
            normal: {
              color: 'source',
              curveness: 0.3,
            }
          },
        },
      ],
    };

    this.migration.echart.setOption(this.migration.option, true);
  };
  
  init() {
    const initConstructor = (canvasName) => {
      return () => {
        this[canvasName].echart = echarts.init(this[canvasName].canvas);

        return request.get(this.mapCanvasToApi(canvasName))
          .then((res) => {
            this[canvasName].isFetching = false;
            this[canvasName].data = res.body;

            return new Promise((resolve, reject) => {
              resolve();
            });
          });
      };
    };
    
    const initMigration = initConstructor('migration');
    
    initMigration()
      .then(() => {
        this.setState({
          ...this.state,
          isFetching: false,
          isError: false,
        });
        this.initSelectBar();
        this.draw(this.state.availableDistricts[0]);
      })
      .catch((e) => {
        this.setState({
          ...this.state,
          isFetching: false,
          isError: true,
        });
      });
  };
  
  onSelect(e) {
    const selectedDistrict = e.target.value;
    
    this.draw(selectedDistrict);
  };
  
  render() {
    return (
      <div>
        <h1>区域人口流动</h1>
        <strong>请求API状态：<em>{this.state.isError ? '请求失败' : (this.state.isFetching ? '正在请求' : '请求成功')}</em></strong>
        <div>
          请选择始发地
          <select className="selectBar" onChange={this.onSelect.bind(this)}>
            {
              this.state.availableDistricts.map((district) => {
                return <option value={district} key={district}>{district}</option>;
              })
            }
          </select>
        </div>
        <div id="migration" style={{"width": "100%", "height": "600px"}}></div>
      </div>
    );
  };
};