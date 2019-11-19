/* eslint-disable */
// @flow
import 'rc-notification/assets/index.css';
import Notification from 'rc-notification';
import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import {
  Configurable,
  FacetResults,
  Masthead,
  MastheadNavTabs,
  NavbarSort,
  PlacementResults,
  SearchBar,
  SearchDebugToggle,
  SearchResults,
  SearchResultsCount,
  SearchResultsFacetFilters,
  SearchResultsPager,
  SecondaryNavBar,
  SpellCheckMessage,
} from '@attivio/suit';
import SearchUIApp from '../SearchUIApp';

let notification = null;
Notification.newInstance({}, (n) => { notification = n; });

type SearchUISearchPageProps = {
  /**
   * Optional. The location of the node through which to interact with Attivio.
   * Defaults to the value in the configuration.
   */
  baseUri: string;

  /**
   * The list of relevancy models to show that will be availale for the user
   * to choose from. If this is set to a single-element array, then that one
   * relevancy model will be used for all queries and the user will not see
   * a menu for choosing the model. If this is not set (and the value is the
   * default, empty array, then the back-end will be queried to obtain the list
   * of known model names.
   */
  relevancyModels: Array<string>;

  /**
   * Whether or not the documents’ relevancy scores should be displayed.
   * Defaults to false.
   */
  showScores: boolean;
  /**
   * A map of the field names to the label to use for any entity fields.
   * Defaults to show the people, locations, and companies entities.
   */
  entityFields: Map<string, string>;
  /**
   * Whether or not to display a toggle for switching the search results
   * to debug format.
   */
  debugViewToggle: boolean;
  /** The names of the fields to include in the sort menu. */
  sortableFields: Array<string>;
  /** The facet field names that should be displayed as pie charts */
  pieChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as bar charts */
  barChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as column charts */
  columnChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as lists with bars */
  barListFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as tag clouds */
  tagCloudFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as time series */
  timeSeriesFacets: Array<string> | string | null;
  /** The facet field names that should be displayed with a sentiment bar */
  sentimentFacets: Array<string> | string | null;
  /** The facet field names that should be displayed with a geographic map */
  geoMapFacets: Array<string> | string | null;
  /**
   * The maximum number of items to show in a facet. If there
   * are more than this many buckets for the facet, only this many, with
   * the highest counts, will be shown. Defaults to 15.
   */
  maxFacetBuckets: number;
  /**
   * An optional list of facet field names which will be used to determine
   * the order in which the facets are shown. Any facets not named here will
   * appear after the called-out ones, in the order they are in in the
   * response.facets array of the parent Searcher component.
   */
  orderHint: Array<string>;
  /** Controls the colors used to show constious entity types (the value can be any valid CSS color) */
  entityColors: Map<string, string>;
  /**
   * The type of engine being used to do the searching. This will affect the way the
   * search results are rendered.
   */
  searchEngineType: 'attivio' | 'solr' | 'elastic';
};

/**
 * Page for doing a simple search using a <Searcher> component.
 */
class SearchUISearchPage extends React.Component<SearchUISearchPageProps, SearchUISearchPageProps, void> {
  static defaultProps = {
    baseUri: '',
    searchEngineType: 'attivio',
    relevancyModels: [],
    showScores: true,
    entityFields: new Map([['people', 'People'], ['locations', 'Locations'], ['companies', 'Companies']]),
    debugViewToggle: true,
    sortableFields: [
      'title',
      'size',
      'date',
    ],
    pieChartFacets: null,
    barChartFacets: null,
    columnChartFacets: null,
    barListFacets: null,
    tagCloudFacets: null,
    timeSeriesFacets: null,
    sentimentFacets: null,
    geoMapFacets: null,
    maxFacetBuckets: 15,
    orderHint: [],
    entityColors: new Map(),
  };

  static contextTypes = {
    searcher: PropTypes.any,
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };
  constructor(props: SearchUILandingPageProps, context: any) {
    super(props, context);
    this.state = {
      queryBuilder: { state: 'none', text: '打开QueryBuilder' },
      queryList: ['1'],
	  defaultSql: { state: 'none', text: '启动DefaultSql' },
    };
  }
  componentWillMount() {
    this.context.searcher.doSearch();
	localStorage.setItem('defaultSql','');
	//监听点击查询按钮
	var _this = this;
	$(document).on('mousedown', '.attivio-globalmast-search-submit',  function(){
	  if(_this.state.defaultSql.state != 'none'){
		if(document.querySelector("ul li a span span").style['visibility']!='hidden'){//简单搜索
			Object.assign(_this.context.searcher.state, { query: document.getElementsByClassName('attivio-globalmast-search-input')[0].value+' '+localStorage.getItem('defaultSql') });//简单搜索拼接
		}else{//高级搜索
			Object.assign(_this.context.searcher.state, { query: "and("+document.getElementsByClassName('attivio-globalmast-search-input')[0].value+","+localStorage.getItem('defaultSql')+")"});//高级搜
		}
	  }else{
	  	Object.assign(_this.context.searcher.state, { query: document.getElementsByClassName('attivio-globalmast-search-input')[0].value});
	  }
	});
    //接受父框架发来的数据
    window.addEventListener('message', function(messageEvent) {
		var data = JSON.parse(messageEvent.data);
		if(data.key=='defaultSql'){//说明是我们需要的数据
			//提示接受到此缓存可通过tab键控制是否使用
			notification.notice({ content: '已收到默认查询条件，可控制是否使用！', duration: 3, style: { background: '#d4b5b2' } });
			//将数据放入缓存
			localStorage.setItem('defaultSql',data.value);
		}
	});
  }
  componentDidUpdate() {
    // 初始化field中显示html代码改为将这些html生效
    const dds = document.querySelectorAll('.attivio-search-result-debugger dd');
    for (const dd of dds) {
      const html = dd.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      dd.innerHTML = html;
    }
	const title = document.querySelectorAll('.attivio-search-result-title');
	for (const dd of dds) {
	  const html = dd.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	  dd.innerHTML = html;
	}
    const tag360s = document.querySelectorAll('.attivio-tags-more');
    for (const tag360 of tag360s) {
      tag360.style.display = 'none';
    }
  }
  downLoad = () => {
    const attivioProtocol = this.context.app.state.config.ALL.attivioProtocol;
    const attivioHostname = this.context.app.state.config.ALL.attivioHostname;
    const attivioPort = this.context.app.state.config.ALL.attivioPort;
    const downLoadParams = this.context.app.state.config.ALL.downLoadParams;
    const query = {
      query: '',
      workflow: 'search',
      queryLanguage: 'simple',
      locale: 'en',
      rows: 5000,
      filters: [],
      facets: [],
      sort: [
        '.score:DESC',
      ],
      fields: [
        '*',
      ],
      facetFilters: [],
      restParams: {
        offset: [
          '0',
        ],
        relevancymodelnames: [
          'default',
        ],
        includemetadatainresponse: [
          'true',
        ],
        highlight: [
          'false',
        ],
        searchProfile: [
          'Attivio',
        ],
      },
      realm: 'aie',
    };
    //query.query = this.context.searcher.state.query;
	if(this.state.defaultSql.state != 'none'){
			query.query = document.getElementsByClassName('attivio-globalmast-search-input')[0].value+' '+localStorage.getItem('defaultSql');
	}else{
		query.query = document.getElementsByClassName('attivio-globalmast-search-input')[0].value;
	}
    if (this.context.searcher.state.geoFilters) {
      query.filters = this.context.searcher.state.geoFilters;
    } else {
      query.filters = [];
    }
    query.filters.push(this.context.searcher.props.queryFilter);
    const url = attivioProtocol + '://' + attivioHostname + ':' + attivioPort + '/rest/searchApi/search';
    query.facetFilters = this.context.searcher.state.facetFilters;
    notification.notice({ content: '查询结果导出中', duration: 3, style: { background: '#d4b5b2' } });
    $.ajax({
      url,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(query),
      success(result) {
        const datas = [];
        let fileName = '';
        const querys = query.query.split(':');
        const downValueLength = downLoadParams.downValueLength;
        if (result.documents.length > downLoadParams.limitLength) {
          notification.notice({ content: '下载超过最大限制' + downLoadParams.limitLength + '条记录', duration: 3, style: { background: '#d4b5b2' } });
          return;
        }
        $.each(result.documents, (index, value) => {
          const id = value.fields[downLoadParams.id] != undefined ? value.fields[downLoadParams.id][0]:'';// inpatientid_s
          const field = value.fields[downLoadParams.field] != undefined ? value.fields[downLoadParams.field][0]: '';// inpatientid_s
          const data = [];
          data.id = id;
          data.field = field;
          if (querys.length > 1) {
            if (querys[0].trim() === '' || querys[0].trim() === '*') {
              notification.notice({ content: '下载需要的匹配字段没有提供', duration: 3, style: { background: '#d4b5b2' } });
              return false;
            }
            if (querys[0].trim() === '' || querys[0].trim() === '*') {
              notification.notice({ content: '下载需要的匹配内容没有提供', duration: 3, style: { background: '#d4b5b2' } });
              return false;
            }
            fileName = querys[1];
            var values = value.fields[querys[0]];
            values = values !== undefined ? values[0] : '';
            values = eval('values.match(/.{0,' + downValueLength + '}' + querys[1].replace(/\*/g,'') + '.{0,' + downValueLength + '}/g)');
			if(values!=null){
				for (var i = 0; i < values.length; i += 1) {
				  data.value = values[i];
				  datas.push(data);
				}	
			}
          } else {
            fileName = querys[0];
            var values = value.fields[downLoadParams.defauleValue];
            values = values !== undefined ? values[0] : '';
            values = eval('values.match(/.{0,' + downValueLength + '}' + querys[0].replace(/\*/g,'') + '.{0,' + downValueLength + '}/g)');
			if (values!=null){
				for (var i = 0; i < values.length; i += 1) {
				  data.value = values[i];
				  datas.push(data);
				}	
			}
          }
        });
				var JSonToCSV = {
				/*
				* obj是一个对象，其中包含有：
				* ## data 是导出的具体数据
				* ## fileName 是导出时保存的文件名称 是string格式
				* ## showLabel 表示是否显示表头 默认显示 是布尔格式
				* ## columns 是表头对象，且title和key必须一一对应，包含有
						title:[], // 表头展示的文字
						key:[], // 获取数据的Key
						formatter: function() // 自定义设置当前数据的 传入(key, value)
				*/
					setDataConver: function(obj) {
						var bw = this.browser();
							if(bw['ie'] < 9) return; // IE9以下的
							var data = obj['data'],
							ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel'],
							fileName = (obj['fileName'] || 'UserExport') + '.csv',
							columns = obj['columns'] || {
							title: [],
							key: [],
							formatter: undefined
						};
						var ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
						var row = "", CSV = '', key;
						// 如果要现实表头文字
						if (ShowLabel) {
							// 如果有传入自定义的表头文字
							if (columns.title.length) {
								columns.title.map(function(n) {
								row += n + ',';
							});
						} else {
							// 如果没有，就直接取数据第一条的对象的属性
							for (key in data[0]) row += key + ',';
						}
						row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
						CSV += row + '\r\n'; // 添加换行符号
					}
					// 具体的数据处理
					data.map(function(n) {
					row = '';
					// 如果存在自定义key值
					if (columns.key.length) {
						columns.key.map(function(m) {
						row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] : n[m]) + '",';
						});
					} else {
						for (key in n) {
							row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] : n[key]) + '",';
						}
					}
					row.slice(0, row.length - 1); // 删除最后一个,
					CSV += row + '\r\n'; // 添加换行符号
					});
					if(!CSV) return;
					this.SaveAs(fileName, CSV);
				},
				SaveAs: function(fileName, csvData) {
					var bw = this.browser();
					if(!bw['edge'] || !bw['ie']) {
						var alink = document.createElement("a");
						alink.id = "linkDwnldLink";
						alink.href = this.getDownloadUrl(csvData);
						document.body.appendChild(alink);
						var linkDom = document.getElementById('linkDwnldLink');
						linkDom.setAttribute('download', fileName);
						linkDom.click();
						document.body.removeChild(linkDom);
					}
					else if(bw['ie'] >= 10 || bw['edge'] == 'edge') {
						var _utf = "\uFEFF";
						var _csvData = new Blob([_utf + csvData], {
						type: 'text/csv'
					});
					navigator.msSaveBlob(_csvData, fileName);
					}
					else {
						var oWin = window.top.open("about:blank", "_blank");
						oWin.document.write('sep=,\r\n' + csvData);
						oWin.document.close();
						oWin.document.execCommand('SaveAs', true, fileName);
						oWin.close();
					}
				},
				getDownloadUrl: function(csvData) {
					var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
					if (window.Blob && window.URL && window.URL.createObjectURL) {
						var csvData = new Blob([_utf + csvData], {
						type: 'text/csv'
						});
					return URL.createObjectURL(csvData);
					}
					// return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
				},
				browser: function() {
					var Sys = {};
					var ua = navigator.userAgent.toLowerCase();
					var s;
					(s = ua.indexOf('edge') !== - 1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
					(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
					(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
					(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
					(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
					(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
					return Sys;
					}
				};
        JSonToCSV.setDataConver({
          data: datas,
          fileName: fileName,
          columns: {
            title: ['id', 'field', 'value'],
            key: ['id', 'field', 'value'],
            formatter: undefined,
          },
        });
      },
      error(e) {
        console.error('e.responseText:' + e.responseText);
      },
    });
  }
  handleClick = () => {
    const attivioProtocol = this.context.app.state.config.ALL.attivioProtocol;
    const attivioHostname = this.context.app.state.config.ALL.attivioHostname;
    const attivioPort = this.context.app.state.config.ALL.attivioPort;
    const fieldValue = this.context.app.state.config.ALL.fieldValue;
    const query = {
      query: '',
      workflow: 'search',
      queryLanguage: 'simple',
      locale: 'en',
      rows: 5000,
      filters: [],
      facets: [],
      sort: [
        '.score:DESC',
      ],
      fields: [
        fieldValue,
		'tags',
      ],
      facetFilters: [],
      restParams: {
        offset: [
          '0',
        ],
        relevancymodelnames: [
          'default',
        ],
        includemetadatainresponse: [
          'true',
        ],
        highlight: [
          'false',
        ],
        searchProfile: [
          'Attivio',
        ],
      },
      realm: 'aie',
    };
    //query.query = this.context.searcher.state.query;
	if(this.state.defaultSql.state != 'none'){
			query.query = document.getElementsByClassName('attivio-globalmast-search-input')[0].value+' '+localStorage.getItem('defaultSql');
	}else{
		query.query = document.getElementsByClassName('attivio-globalmast-search-input')[0].value;
	}
    if (this.context.searcher.state.geoFilters) {
      query.filters = this.context.searcher.state.geoFilters;
    } else {
      query.filters = [];
    }
    query.filters.push(this.context.searcher.props.queryFilter);
    const url = attivioProtocol + '://' + attivioHostname + ':' + attivioPort + '/rest/searchApi/search';
    query.facetFilters = this.context.searcher.state.facetFilters;
    notification.notice({ content: '查询结果导出中，正在创建新表存入此结果', duration: 3, style: { background: '#d4b5b2' } });
    $.ajax({
      url,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(query),
      success(result) {
        const resultArray = [];
        resultArray.push(query.query);
        $.each(result.documents, (index, value) => {
          const title = value.fields ? value.fields[fieldValue] : '';
		  const tags = value.fields['tags']==undefined?'' : value.fields['tags'].join("、");
		  const field = title + ';'+tags;
          resultArray.push(field.toString().replace(',', '，').replace(';', '；'));
        });
        const result1 = resultArray.join(',');
        console.log('result:' + result1);
        parent.postMessage(result1, '*');
      },
      error(e) {
        console.error('e.responseText:' + e.responseText);
      },
    });
  };
  switchBuilder = () => {
    if (this.state.queryBuilder.state === 'none') {
      Object.assign(this.state, { queryBuilder: { state: '', text: '关闭QueryBuilder' } });
      this.setState(this.state);
      this.state.queryBuilderState = '';
      document.getElementsByClassName('queryBuilder')[0].style.visibility = 'visible';
    } else {
      Object.assign(this.state, { queryBuilder: { state: 'none', text: '打开QueryBuilder' } });
      document.getElementsByClassName('queryBuilder')[0].style.visibility = 'hidden';
    }
  };
  switchDefaultSql = () => {
	if (this.state.defaultSql.state === 'none') {
	  Object.assign(this.state, { defaultSql: { state: '', text: '禁用DefaultSql' } });
	  this.setState(this.state);
	  // 恢复原始input内容
	  //var defaultSql = localStorage.getItem('defaultSql');
	  //document.getElementsByClassName('attivio-globalmast-search-input')[0].value = document.getElementsByClassName('attivio-globalmast-search-input')[0].value.replace(new RegExp(' '+defaultSql+'$'),'');
	} else {
	  Object.assign(this.state, { defaultSql: { state: 'none', text: '启用DefaultSql' } });
	  this.setState(this.state);
	  // 恢复原始input内容
	  //var defaultSql = localStorage.getItem('defaultSql');
	  //document.getElementsByClassName('attivio-globalmast-search-input')[0].value = document.getElementsByClassName('attivio-globalmast-search-input')[0].value.replace(new RegExp(' '+defaultSql+'$'),'');
	}
  };
  listenSbline = (e) => {
    const name = e.target.className;
    if (name === 'sb_add') {
      this.addSbline();
    } else if (name === 'sb_subt') {
      if (e.currentTarget.childElementCount !== 1) {
        const name1 = e.target.parentElement.getAttribute('name');
        const i = this.state.queryList.indexOf(name1);
        this.state.queryList.splice(i, 1);
        this.setState(this.state);
      }
    }
  };
  addSbline = () => {
    let id = Math.random().toString();
    while (this.state.queryList.indexOf(id) >= 0) {
      id = Math.random().toString();
    }
    this.state.queryList.push(id);
    this.setState(this.state);
  };
  queryTextChange = () => {
    const length = document.getElementsByClassName('sb_line').length;
    let queryText = '';
    for (let i = 0; i < length; i += 1) {
      const sbLine = document.getElementsByClassName('sb_line')[i];
      let sbOperate = sbLine.getElementsByClassName('sb_operate')[0].value;
      if (i === 0) {
        sbOperate = '';
      }
      const sbField = sbLine.getElementsByClassName('sb_field')[0].value;
      const sbInput = sbLine.getElementsByClassName('sb_input')[0].value;
      if (sbInput !== '') {
        queryText += sbOperate + sbField + sbInput;
      }
    }
    const o = document.getElementsByClassName('attivio-globalmast-search-input')[0];
    o.value = queryText;
    Object.assign(this.context.searcher.state, { query: queryText });
    o.dispatchEvent(new Event('input', { bubbles: true }));
  }
  renderSecondaryNavBar() {
    return (
      <SecondaryNavBar>
        <SearchResultsCount />
        <SearchResultsFacetFilters />
        <SearchResultsPager right />
        <NavbarSort
          fieldNames={this.props.sortableFields}
          includeRelevancy
          right
        />
        <SearchDebugToggle right />
      </SecondaryNavBar>
    );
  }

  render() {
    const showScores = this.props.showScores && this.props.searchEngineType === 'attivio';
    const showTags = this.props.searchEngineType === 'attivio';
    const queryLists = this.state.queryList.map((id) => {
      return (
        <div className="sb_line form-inline" key={id} name={id}>
          <select className="sb_operate form-control" onChange={this.queryTextChange}>
            <option value=" ">AND</option>
            <option value=" OR ">OR</option>
            <option value=" -">NOT</option>
          </select>
          <select className="sb_field form-control" onChange={this.queryTextChange}>
            <option value="">All Fields</option>
            <option value="title:">title</option>
            <option value="size:">size</option>
          </select>
          <input className="sb_input form-control" type="text" onChange={this.queryTextChange} />
          <button className="sb_subt">-</button>
          <button className="sb_add">+</button>
        </div>
      );
    });
    return (
      <DocumentTitle title="Search: Attivio Cognitive Search">
        <div>
          <Masthead multiline homeRoute="/landing">
            <MastheadNavTabs initialTab="/results" tabInfo={this.context.app.getMastheadNavTabs()} />
            <div className="attivio-tabpanel-radio attivio-tabpanel-radio-navbar attivio-globalmast-tabpanel">
              <ul className="nav nav-tabs">
                <li className="active">
                  <a role="button" tabIndex="0" onClick={this.handleClick}>Export</a>
                </li>
                <li className="active">
                  <a role="button" tabIndex="0" className="switchBuilderForResult switchBuilder" onClick={this.switchBuilder}>{ this.state.queryBuilder.text }</a>
                </li>
				<li className="active">
				  <a role="button" tabIndex="0" onClick={this.switchDefaultSql}>{this.state.defaultSql.text}</a>
				</li>
              </ul>
            </div>
            <div className="queryBuilder queryBuilderForResult" onInput={this.queryTextChange} onClick={(e) => { this.listenSbline(e); }} style={{ display: this.state.queryBuilder.state }}>
              {queryLists}
            </div>
            <SearchBar
              inMasthead
            />
			<div className="attivio-tabpanel-radio attivio-tabpanel-radio-navbar attivio-globalmast-tabpanel">
			  <ul className="nav nav-tabs">
				<li className="active">
				  <a role="button" tabIndex="0" onClick={this.downLoad}>Download</a>
				</li>
			  </ul>
			</div>
          </Masthead>
          {this.renderSecondaryNavBar()}
          <div style={{ padding: '10px' }}>
            <Grid fluid>
              <Row>
                <Col xs={12} sm={5} md={4} lg={3}>
                  <FacetResults
                    pieChartFacets={this.props.pieChartFacets}
                    barChartFacets={this.props.barChartFacets}
                    columnChartFacets={this.props.columnChartFacets}
                    barListFacets={this.props.barListFacets}
                    tagCloudFacets={this.props.tagCloudFacets}
                    timeSeriesFacets={this.props.timeSeriesFacets}
                    sentimentFacets={this.props.sentimentFacets}
                    geoMapFacets={this.props.geoMapFacets}
                    maxFacetBuckets={this.props.maxFacetBuckets}
                    orderHint={this.props.orderHint}
                    entityColors={this.props.entityColors}
                  />
                </Col>
                <Col xs={12} sm={7} md={8} lg={9}>
                  <PlacementResults />
                  <SpellCheckMessage />
                  <SearchResults
                    format={this.context.searcher.state.format}
                    entityFields={this.props.entityFields}
                    baseUri={this.props.baseUri}
                    showScores={showScores}
                    showTags={showTags}
                  />
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default Configurable(SearchUISearchPage);
