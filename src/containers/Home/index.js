import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as UserActions from '../../store/user/createActions';

class Home extends Component {

  state = {
    number: 0
  };

  handleClick = () => {
    this.setState({
      number: this.state.number + 1
    });
  };

  incrementAge = () => {
    this.props.propIncrementAge();
  };

  componentDidMount () {
    if (!this.props.user.schoolList.length) {
      this.props.propGetSchoolList();
    }
  }

  render() {
    return (
      <div>
        <h2>HELLO, HOME PAGE</h2>
        <h2>
          <button className="btn btn-primary" onClick={this.handleClick}>click</button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>{this.state.number}</span>
        </h2>
        <ul className="list-group">
          <li className="list-group-item">name: {this.props.user.name}</li>
          <li className="list-group-item">
            <button className="btn btn-primary" onClick={this.incrementAge}>increment age</button> &nbsp;&nbsp;&nbsp;&nbsp;
            <span>{this.props.user.age}</span></li>
        </ul>
        {/* <h2>
          <button className="btn btn-primary" onClick={this.getSchoolList}>schoolList</button>
        </h2> */}
        <ul className="list-group">
          {
            this.props.user.schoolList.map(school => (
              <li key={school.id} className="list-group-item">
                {school.id}. {school.name}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  propIncrementAge() {
    dispatch(UserActions.incrementAge());
  },
  propGetSchoolList() {
    dispatch(UserActions.getSchoolList());
  }
});

Home.loadData = store => store.dispatch(UserActions.getSchoolList());

export default connect(mapStateToProps, mapDispatchToProps)(Home);