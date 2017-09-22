import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './pages/home';
import Polyline from './pages/polyline';
import Curve from './pages/curve';
import Marker from './pages/marker';
import External from './pages/external';
import ReleaseNote from './pages/releasenote';
import Statistics from './pages/statistics';
import StationWithCitizenCard from './pages/stationWithCitizenCard';
import RouteWithCitizenCard from './pages/routeWithCitizenCard';
import Migration from './pages/migration';
import OriginDestinationSummary from './pages/originDestinationSummary';
import Heatmap from './pages/heatmap';
import Playground from './pages/playground';
import Bq from './pages/bq';

import Styles from './index.css';

injectTapEventPlugin();

/*
  *show Home page at root path
*/
render(
  <MuiThemeProvider>
    <Router>
      <div>
        <Route exact path='/' component={Home} />
        <Route exact path='/polyline' component={Polyline} />
        <Route exact path='/curve' component={Curve} />
        <Route exact path='/marker' component={Marker} />
        <Route exact path='/external' component={External} />
        <Route exact path='/statistics' component={Statistics} />
        <Route exact path='/stationWithCitizenCard' component={StationWithCitizenCard} />
        <Route exact path='/routeWithCitizenCard' component={RouteWithCitizenCard} />
        <Route exact path='/migration' component={Migration} />
        <Route exact path='/originDestinationSummary' component={OriginDestinationSummary} />
        <Route exact path='/heatmap' component={Heatmap} />
        <Route exact path='/playground' component={Playground} />
        <Route exact path='/releasenote' component={ReleaseNote} />
        <Route exact path='/bq' component={Bq} />
      </div>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('app')
);