import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class News extends Component {
  render() {
    return (
      <>
        <Helmet>
          <title>hello, News</title>
          <meta name="描述" content="这是 News 页面" />
        </Helmet>
        <div>
          <h1>News Page</h1>
        </div>
      </>
    );
  }
}

export default News;