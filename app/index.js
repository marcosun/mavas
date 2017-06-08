import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Home from './Home';

/*
  *show Home page at root path
*/
render(
  <Router>
    <Route exact path='/' component={Home} />
  </Router>,
  document.getElementById('app')
);