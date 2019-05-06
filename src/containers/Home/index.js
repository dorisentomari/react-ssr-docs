import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as UserActions from '../../store/user/createActions';
import styles from './index.css';
import WithStyle from '../../withStyle';

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

  // componentWillMount() {
  //   let staticContext = this.props.staticContext;
  //   if (staticContext) {
  //     if (staticContext) {
  //       staticContext.csses.push(styles._getCss());
  //     }
  //   }
  // }

  componentDidMount() {
    if (!this.props.user.schoolList.length) {
      this.props.propGetSchoolList();
    }
  }

  render() {
    return (
      <>
        <Helmet>
          <title>hello, Home</title>
          <meta name="描述" content="这是 Home 页面" />
        </Helmet>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>HELLO, HOME PAGE</h2>
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
      </>
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

const ExportHome = connect(mapStateToProps, mapDispatchToProps)(WithStyle(Home, styles));

ExportHome.loadData = store => store.dispatch(UserActions.getSchoolList());

export default ExportHome;