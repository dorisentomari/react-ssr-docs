import React, { Component } from 'react';

export default (DecoratedComponent, styles) => {
  return class NewComponent extends Component {
    componentWillMount() {
      if (this.props.staticContext) {
        this.props.staticContext.csses.push(styles._getCss());
      }
    }

    render() {
      return (<DecoratedComponent {...this.props} />);
    }

  };
};
