import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';

import Home from './pages/home';
import Polyline from './pages/polyline';
import Curve from './pages/curve';
import Marker from './pages/marker';
import External from './pages/external';
import ReleaseNote from './pages/releasenote';
import Statistics from './pages/statistics';
import Migration from './pages/migration';
import OriginDestinationSummary from './pages/originDestinationSummary';
import Heatmap from './pages/heatmap';
import Playground from './pages/playground';

import Styles from './index.css';

/*
  *show Home page at root path
*/
render(
  <Router>
    <div>
      <Route exact path='/' component={Home} />
      <Route exact path='/polyline' component={Polyline} />
      <Route exact path='/curve' component={Curve} />
      <Route exact path='/marker' component={Marker} />
      <Route exact path='/external' component={External} />
      <Route exact path='/statistics' component={Statistics} />
      <Route exact path='/migration' component={Migration} />
      <Route exact path='/originDestinationSummary' component={OriginDestinationSummary} />
      <Route exact path='/heatmap' component={Heatmap} />
      <Route exact path='/playground' component={Playground} />
      <Route exact path='/releasenote' component={ReleaseNote} />
    </div>
  </Router>,
  document.getElementById('app')
);