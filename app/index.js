import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Polyline from './polyline';
import Marker from './marker';

/*
  *show Home page at root path
*/
render(
  <Router>
    <div>
      <Route exact path='/polyline' component={Polyline} />
      <Route exact path='/marker' component={Marker} />
    </div>
  </Router>,
  document.getElementById('app')
);