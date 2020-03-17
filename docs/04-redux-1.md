# 1. redux
+ 路由完成了之后，我们就需要考虑数据了，我们采用使用的最为广泛的 redux 来管理 react 的数据状态
+ 更新 store 有三种
  + 同步，这个同步是包括客户端和服务端的统一更新
  + 客户端异步，这个就是平时我们常用的客户端发送请求，异步获取数据，然后修改 store 的值
  + 服务端异步，这个比较复杂， 放在下一节介绍
+ 所以这一节主要介绍同步更新 store 和客户端异步更新 store

## 1.1 介绍
+ store 的创建分为两种，一种是客户端，另外一种是服务端，而且每一个端的 store 都要分开，作为一个方法调用，这样做的目的是客户端的话，每一个用户都有一个客户端，使用的是自己的 store 里的数据，但是服务端不一样，无论有多少个客户端，服务端只有一个，所以，为了避免每个用户的 store 数据混乱，所以我们把服务端的 store 作为一个方法调用，这样，每个用户调用服务端 store 的时候，就有一个自己的方法，调用的是自己的数据，这样，数据就不会混乱
+ 客户端使用 store 的方法和平时的客户端渲染是一样的，没有区别
+ 服务端使用 store 的方法也仅仅是在 StaticRouter 外边包裹一层 Provider，然后传入服务端的 store 即可

## 1.2 redux 需要使用到的库
+ `npm i redux react-redux redux-thunk redux-logger -S`
+ `npm i redux-devtools-extension -D`
+ redux，这个就是 redux 的核心库
+ react-redux，由于 react 和 redux 是完全没有关系的，是可以互相独立使用的，可以直接在 react 里引入 redux，但是用起来比较麻烦，不太方便。所以我们为了方便在 react 和 redux 之间建立联系，所以我们使用 react-redux
+ redux-thunk，让 redux 在 dispatch 的时候，使用一个方法，这里我们用的方法主要是为了异步获取数据
+ redux-logger，在控制台上显示 state 变化的记录
+ redux-devtools-extension，这个是一个谷歌浏览器上的 [redux](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-CN) 的插件，这个插件需要我们使用中间件开启，才能够查看到 state 的变化状态

# 2. 使用最简单的 redux
+ 由于代码比较简单，与平时我们客户端使用 redux 差异很小，所以直接看代码也可以看明白的
+ 这里的功能有三个
  + 第一个是直接获取 redux 里的数据，获取 user 下的 username 的值
  + 第二个是获取完数据后，还可以点击按钮，修改 user 下的 age 的值
  + 第三个是客户端调用第三方接口，获取数据，修改 user 下的 schoolList 的值

## 2.1 创建 store
+ store/index.js

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

export const getServerStore = () => createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, logger))
);

export const getClientStore = () => createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, logger))
);
```

+ store/reducers.js

```javascript
import { combineReducers } from 'redux';

import userReducer from './user/reducer';

export default combineReducers({
  user: userReducer
});
```

+ store/user/actionTypes.js

```javascript
export const SET_INCREMENT_AGE = 'SET_INCREMENT_AGE';

export const GET_SCHOOL_LIST = 'GET_SCHOOL_LIST';
```

+ store/user/createActions.js
  + 关于 action 的值，有人喜欢用 payload，有人喜欢直接用需要的值的变量名，这个用什么都行，只要前后统一即可，没有强制性的规范。
  + 由于在 redux-logger 里采用的是 payload，所以建议还是使用 payload
  + 这实际上就是一个属性值，只要保证 actions 里定义的和 reducer 里获取的是同一个就行
  + 注意：这里的接口，是一个模拟的接口，就是下边的 2.4 节接口服务，自己可以简单定义一个接口，目的是为了做 ajax 请求响应数据
```javascript
import * as Types from './actionTypes';
import axios from 'axios';

export const incrementAge = () => {
  return {
    type: Types.SET_INCREMENT_AGE
  }
};

export const getSchoolList = () => {
  return (dispatch) => {
    return axios.get('http://localhost:8758/api/getSchoolList').then(res => {
      if (res.status === 200) {
        let schoolList = res.data.schoolList;
        console.log(res.data);
        dispatch({
          type: Types.GET_SCHOOL_LIST,
          payload: schoolList
        });
      }
    });
  }
}
```

+ store/user/reducer.js

```javascript
import * as Types from './actionTypes';

const initState = {
  name: 'mark',
  age: 18,
  schoolList: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case Types.SET_INCREMENT_AGE:
      return { ...state, age: state.age + 1 };
    case Types.GET_SCHOOL_LIST:
      console.log(action);
      return { ...state, schoolList: action.payload };
    default:
      return { ...state };
  }
}
```
## 2.2 路由文件的修改
+ 之所以要修改路由文件，其实是否修改在这里没什么影响，但是在下一小节里也是需要修改的，而且这一小节也比较简单，所以直接放在这里修改，避免与下一节的内容搞混乱
+ 之前我们的路由是这么写的

```javascript
export default (
  <>
    <Route path='/' exact component={Home}/>
    <Route path='/news' component={News}/>
  </>
);
```
+ 现在我们改成数组对象的形式，因为这样可以方便我们在组件上进行异步数据加载

```javascript
export default [
  {
    path: '/',
    component: Home,
    exact: true,
    key: '/'
  },
  {
    path: '/news',
    component: News,
    exact: true,
    key: '/news'
  }
];
```

+ 然后我们在客户端和服务端循环遍历，再组装改成 Route 的形式，仔细看看这两种写法也没啥区别，就是换了一种形式而已，为了方便后边我们使用

```javascript
{
  routes.map(route => <Route {...route} />)
}
```

## 2.2 客户端下的 redux

+ client/index.js

```javascript
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { getClientStore } from "../store";

hydrate(
  <Provider store={getClientStore()}>
    <BrowserRouter>
      <>
        <Header/>
        <div className="container" style={{ marginTop: 70 }}>
            {
              routes.map(route => <Route {...route} />)
            }
          </div>
      </>
    </BrowserRouter>
  </Provider>, window.root);
```

+ containers/Home/index.js
  + 关于 react-redux 的 connect 的用法，可以把 connect 作为组件的装饰器使用，也可以作为函数直接调用使用，因为装饰器实际上就是函数多次调用的语法糖，所以我统一把 connect 的写成函数调用的形式
  + connect 的参数，可以直接把方法写在参数里，也可以像这里一样，把 mapStateToProps 和 mapDispatchToProps 先定义成方法，然后直接把方法作为参数
  + 关于 actions 里方法的调用，我这里采用的方法，其实是有些复杂的，最简单其实就是直接在组件内部调用 actions 里的方法。我在这里又在组件内部定义了一个方法 A ，在这个组件的 props 里又定义了一个方法 B ，假如 actions 里的方法是 C 。那么最简单的方法就是直接调用 this.props.C()，但是我这里的顺序是这样的，先调用 A()，然后 A() 调用 B()，最后在 B() 里调用 C()。具体如何调用呢，根据个人喜好选择。
  + 这里呢，倒不是我鸡贼，总是说怎么用都行，实际上这个也没有什么标准写法。我还是蛮喜欢现在这种写法的，比较清晰明了，传递参数和调用什么的，都很方便，缺点就是代码量多，修改的时候，改动多

```javascript
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

  getSchoolList = () => {
    this.props.propGetSchoolList();
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
        <h2>
          <button className="btn btn-primary" onClick={this.getSchoolList}>schoolList</button>
        </h2>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
```

## 2.3 服务端下的 redux
+ 服务端的 redux 在同步的状态下，写起来比较简单，没有什么复杂的，其实就是直接把 store 传递给 Provider 就可以
+ server/index.js

```javascript
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';

let domContent = renderToString(
  <Provider store={getServerStore()}>
    <StaticRouter context={context} location={req.path}>
      <>
        <Header/>
        <div className="container" style={{ marginTop: 70 }}>
            {
              routes.map(route => <Route {...route} />)
            }
          </div>
      </>
    </StaticRouter>
  </Provider>
);
```

## 2.4 接口服务
+ /server/app.js，这里已经完全放开了跨域，暂不处理，后期要做修改调整

```javascript
const express = require('express');

let app = express();
const PORT = 8758;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  next();
});

app.get('/api/getSchoolList', (req, res) => {
  let schoolList = [
    { id: 1, name: '动物大学' },
    { id: 2, name: '植物大学' },
    { id: 3, name: '建筑大学' },
    { id: 4, name: '服装大学' }
  ]
  return res.json({ schoolList });
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`the server is running at http://localhost:${PORT}`);
  }
});
```

## 2.4 总结
+ 总的来看，同步的 redux 和客户端异步获取数据，用起来实际上跟普通的客户端渲染的时候，没什么大的区别，所以还是比较简单的
+ 复杂的是服务端异步获取，这里牵涉到组件的方法，promise 的包装，脱水和注水等，我们统一放到下一节介绍

# 3. 拆分 server/index.js 里的代码
+ 因为后边我们要多次修改 server/index.js 的代码，所以先把代码进行拆分，拆分出一个 render.js 的文件，专门用来做渲染，而 index.js 文件只做单独的服务

+ /server/index.js

```javascript
import express from 'express';
import render from './render';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('*', (req, res) => {
  render(req, res);
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});
```

+ /server/render.js

```javascript
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Route, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getServerStore } from '../store';

import Header from './../components/Header/index';
import routes from '../routes';

export default (req, res) => {

  let context = {};

  let store = getServerStore();

  let domContent = renderToString(
      <Provider store={store}>
        <StaticRouter context={context} location={req.path}>
          <>
            <Header />
            <div className="container" style={{ marginTop: 70 }}>
              {
                routes.map(route => <Route {...route} />)
              }
            </div>
          </>
        </StaticRouter>
      </Provider>
    );
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
  <title>react-ssr</title>
</head>
<body>
<div id="root">${domContent}</div>
<script>
  window.context = {
    state: ${JSON.stringify(store.getState())}
  }
</script>
<script src="/client.js"></script>
</body>
</html>
`;

    res.send(html);
};
```

# docs 文档链接
+ [01-项目基础架构搭建](./01-项目基础架构搭建.md)
+ [02-最简单的服务端渲染](./02-最简单的服务端渲染.md)
+ [03-路由](./03-路由.md)
+ [04-redux-01](./04-redux-1.md)
+ [05-redux-02](./05-redux-2.md)
+ [06-优化](./06-优化.md)
+ [07-添加CSS样式](./07-添加CSS样式.md)
+ [08-404和重定向](./08-404和重定向.md)
+ [09-SEO优化](./09-SEO优化.md)
