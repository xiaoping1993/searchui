// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import {
  Configurable,
  Masthead,
  MastheadNavTabs,
  QueryResponse,
  SearchBar,
  SimpleQueryRequest,
} from '@attivio/suit';

import SearchUIApp from '../SearchUIApp';

type SearchUILandingPageProps = {
  logoUri: string | null;
  logoWidth: string | null;
  logoHeight: string | null;
  logoAltText: string | null;
};

type SearchUILandingPageDefaultProps = {
  logoUri: string | null;
  logoWidth: string | null;
  logoHeight: string | null;
  logoAltText: string | null;
};

type SearchUILandingPageState = {
  numDocuments: number;
  numTables: number;
  loading: boolean;
  error: string | null;
};

class SearchUILandingPage extends React.Component<SearchUILandingPageDefaultProps, SearchUILandingPageProps, SearchUILandingPageState> { // eslint-disable-line max-len
  static defaultProps = {
    logoUri: null,
    logoWidth: null,
    logoHeight: null,
    logoAltText: null,
  };

  static contextTypes = {
    searcher: PropTypes.any,
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  constructor(props: SearchUILandingPageProps, context: any) {
    super(props, context);
    this.state = {
      numDocuments: 0,
      numTables: 0,
      loading: true,
      error: null,
      queryBuilder: { state: 'none', text: '打开QueryBuilder' },
      queryList: ['1'],
    };
  }

  state: SearchUILandingPageState;

  componentDidMount() {
    const searcher = this.context.searcher;
    searcher.state.response = undefined;
    if (searcher) {
      const qr = new SimpleQueryRequest();
      qr.rows = 0;
      qr.facets = ['table(maxNumBuckets=-1)'];
      searcher.doCustomSearch(qr, (response: QueryResponse | null, error: string | null) => {
        if (response) {
          const numDocuments = response.totalHits;
          let numTables = 0;
          if (response.facets &&
            response.facets.length === 1 &&
            response.facets[0].field === 'table' &&
            response.facets[0].buckets
          ) {
            numTables = response.facets[0].buckets.length;
          }
          this.setState({
            numDocuments,
            numTables,
            loading: false,
            error: null,
          });
        } else if (error) {
          this.setState({
            numDocuments: 0,
            numTables: 0,
            loading: false,
            error,
          });
        }
      });
    }
  }
  switchBuilder = () => {
    if (this.state.queryBuilder.state === 'none') {
      Object.assign(this.state, { queryBuilder: { state: '', text: '关闭QueryBuilder' } });
      this.setState(this.state);
      this.state.queryBuilderState = '';
      document.getElementsByClassName('form-control')[0].disabled = true;
    } else {
      Object.assign(this.state, { queryBuilder: { state: 'none', text: '打开QueryBuilder' } });
      this.setState(this.state);
      document.getElementsByClassName('form-control')[0].disabled = false;
    }
  }
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
  }
  addSbline = () => {
    let id = Math.random().toString();
    while (this.state.queryList.indexOf(id) >= 0) {
      id = Math.random().toString();
    }
    this.state.queryList.push(id);
    this.setState(this.state);
  }
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
    const o = document.getElementsByClassName('form-control')[0];
    o.value = queryText;
    o.dispatchEvent(new Event('input', { bubbles: true }));
  }
  render() {
    let docs;
    switch (this.state.numDocuments) {
      case 0:
        docs = 'no documents';
        break;
      case 1:
        docs = 'one document';
        break;
      default:
        docs = `${this.state.numDocuments.toLocaleString()} documents`;
        break;
    }
    let sources;
    switch (this.state.numTables) {
      case 0:
        sources = 'no sources';
        break;
      case 1:
        sources = 'one source';
        break;
      default:
        sources = `${this.state.numTables} sources`;
        break;
    }

    if (this.context.searcher.search
      && this.context.searcher.search.searchEngineType
      && this.context.searcher.search.searchEngineType !== 'attivio'
    ) {
      sources = '1 source';
    }

    const indexStatusLabel = this.state.loading ? 'Analyzing your index\u2026' : `Searching across ${docs} from ${sources}.`;
    const logoUri = this.props.logoUri ? this.props.logoUri : 'img/attivio-logo.png';
    const logoAltText = this.props.logoAltText ? this.props.logoAltText : 'Attivio';
    const logoStyle = {};
    if (this.props.logoWidth) {
      logoStyle.width = this.props.logoWidth;
    }
    if (this.props.logoHeight) {
      logoStyle.height = this.props.logoHeight;
    }
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
      <div>
        <Masthead multiline homeRoute="/landing">
          <MastheadNavTabs initialTab="/" tabInfo={this.context.app.getMastheadNavTabs()} />
        </Masthead>
        <Grid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div style={{ textAlign: 'center', paddingTop: '20vh' }}>
                <div style={{ display: 'inline-block', width: '50%' }}>
                  <img src={logoUri} alt={logoAltText} style={logoStyle} />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div style={{ textAlign: 'center', paddingTop: '25px' }}>
                <div style={{ display: 'inline-block', width: '50%' }}>
                  <SearchBar
                    allowLanguageSelect={false}
                    route="/results"
                  />
                  <button className="switchBuilder btn btn-primary" onClick={this.switchBuilder}>{ this.state.queryBuilder.text }</button>
                  <div className="queryBuilder" onInput={this.queryTextChange} onClick={(e) => { this.listenSbline(e); }} style={{ display: this.state.queryBuilder.state }}>
                    {queryLists}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div style={{ textAlign: 'center', paddingTop: '25px' }}>
                <div style={{ display: 'inline-block', width: '50%' }}>
                  {indexStatusLabel}
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Configurable(SearchUILandingPage);
