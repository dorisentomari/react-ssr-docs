import React, { Component } from 'react';

class NotFound extends Component {

  componentWillMount() {
    const { staticContext } = this.props;
    staticContext && (staticContext.NotFound = true);
  }

  render() {
    return (
      <div>404 NotFound</div>
    );
  }
}

export default NotFound;
