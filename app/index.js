import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';

import Polyline from './polyline';
import Marker from './marker';
import External from './external';
import ReleaseNote from './releasenote';
import BusTicketSummary from './busTicketSummary';
import OriginDestinationSummary from './originDestinationSummary';
import Heatmap from './heatmap';

import Styles from './index.css';

/*
  *show Home page at root path
*/
render(
  <Router>
    <div>
      <Route exact path='/' render={() => (<Redirect to='/marker' />)} />
      <Route exact path='/polyline' component={Polyline} />
      <Route exact path='/marker' component={Marker} />
      <Route exact path='/external' component={External} />
      <Route exact path='/releasenote' component={ReleaseNote} />
      <Route exact path='/busTicketSummary' component={BusTicketSummary} />
      <Route exact path='/originDestinationSummary' component={OriginDestinationSummary} />
      <Route exact path='/heatmap' component={Heatmap} />
    </div>
  </Router>,
  document.getElementById('app')
);