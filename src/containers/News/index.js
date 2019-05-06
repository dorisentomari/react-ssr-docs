import React, { Component } from 'react';
import {Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

class News extends Component {
  render() {
    return (
      <Redirect to="/" />
    );
  }
}

export default News;