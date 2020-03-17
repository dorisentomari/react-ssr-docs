import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import Header from './components/Header';

class App extends Component {

  render() {
    return (
      <div>
        <Header staticContext={this.props.staticContext} />
        <div className="container" style={{ marginTop: 70 }}>
          {renderRoutes(this.props.route.routes)}
        </div>
      </div>
    );
  }
}

export default App;
