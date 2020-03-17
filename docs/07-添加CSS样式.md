# 1. CSS 样式的添加
+ 我们之前配置的 webpack，仅仅是配置了 js，对于 css 及 css 预处理器都没有配置，所以我们需要配置一下 css，我们统一采用 sass 预处理器

## 1.1 webpack.client.js 的配置
+ 这里就要问了，为什么不把 css 配置到 webpack.base.js 里呢，因为服务端不识别 css 代码，所以我们不能简单的把 css 配置信息写在 webpack.base.js 里
+ 下载依赖 `npm i node-sass sass-loader -D`
+ 修改 webpack.client.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }
        ]
      }
    ]
  }
}
```

## 1.2 webpack.server.js 的配置
+ 服务器端不能直接识别 css 资源，但是我们还是需要服务器端能够识别 css 资源，所以我们使用一个库，专门用来为服务端识别 css，这个库是 isomorphic-style-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: ['isomorphic-style-loader', {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:5]'
          }
        }]
      }
    ]
  }
}
```

## 1.3 组件使用 css 样式
+ 组件使用 css 样式的时候，可以像以前一样，直接引入 css 文件，把样式作用在对应的 DOM 标签上
+ /src/containers/Home/index.css

```css
/**
 * /src/containers/Home/index.css
 */
.wrapper {
  background: orange;
}

.title {
  color: red;
  font-size: 26px;
}
```

+ /src/containers/Home/index.js

```javascript
// /src/containers/Home/index.js
import styles from './index.css';

class Home extends Component {

  render() {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>HELLO, HOME PAGE</h2>
      </div>
    );
  }
}
```

+ 直接这样使用，我们就可以在页面上看到对应的 css 样式
+ 但是这样有两个问题
  + 第一个问题是，浏览器必须要开启 js，如果不开启 js，那么样式是不生效的
  + 第二个问题是，当我们的页面刷新频率过快，并且不使用缓存，那么页面有非常明显的抖动
+ 这两个问题对用户来说，体验非常不好，所以我们进一步改进

## 1.4 把样式注入到服务端的 HTML 模板中
+ 实际上，上面我们用的方式是把 css 写在了 js 里边，如果我们查看页面的源代码，我们只能在页面上找到 DOM 元素的类名，但是我们找不到任何的 css 代码，因为全部都在 /client.js 里，所以我们要把 css 从 js 里拿出来，写在 HTML 页面上
+ 当我们引入一个 css 文件的时候，引入的模块就自带一些属性，这些属性是 webpack 所提供的，我们可以看一下

```javascript
import styles from './index.css';

console.log(styles);

{ wrapper: 'index_wrapper_2wP7c',
  title: 'index_title_39dQ8',
  _getContent: [Function],
  _getCss: [Function],
  _insertCss: [Function]
}

--------------------------------------------------

console.log(styles._getContent());

[
  [ './node_modules/_css-loader@2.1.1@css-loader/dist/cjs.js?!./src/containers/Home/index.css',
    '.index_wrapper_2wP7c {\r\n  background: orange;\r\n}\r\n\r\n.index_title_39dQ8 {\r\n  color: red;\
\n  font-size: 26px;\r\n}\r\n', '' ],
  toString: [Function: toString],
  i: [Function],
  locals: { wrapper: 'index_wrapper_2wP7c',
    title: 'index_title_39dQ8',
    _getContent: [Function],
    _getCss: [Function],
    _insertCss: [Function] } ]

--------------------------------------------------

console.log(styles._getCss());

.index_wrapper_2wP7c {
  background: orange;
}

.index_title_39dQ8 {
  color: red;
  font-size: 26px;
}

```

+ 我们依次在控制台输出 styles 的一些属性，我们可以查看到， 我们定义的类名，已经被进行了转换，而且我们定义的样式，全部都在 styles._getCss() 里
+ 所以，我们可以把类名赋值需要使用的 DOM 元素，css 样式的内容，传递给服务端，让服务端直接把样式载入到 HTML 模板中
+ 但是该怎么操作呢？前边我们说到了 StaticRouter 静态路由有一个 context 的属性，这个属性是用来前后端进行传递数据的，所以我们可以把数据通过 context 传递
+ 我们直接在 Home 组件里输出一下 this.props，我们会发现有一个非常有意思的现象，就是在浏览器的控制台，输出的 props.staticContext 的值是 undefined，但是在服务端的控制台，输出的是一个对象，里边的 csses 的属性值是我们之前定义的 css 内容
+ 这是因为，staticContext 虽然能够传值，但是传值仅仅存在与服务端和组件之间，并不在客户端和组件之间，我们我们在服务端就可以拿到 css 的样式
+ 拿到 css 样式后，直接把 css 内容作为字符串，添加到 HTML 模板的 style 标签里，就可以了
+ **注意:** context.csses 必须为数组类型，把每一个组件的样式作为一个元素 push 到数组中，这样每一个组件的 css 样式都可以生效，但是，如果我们直接把 css 的样式赋值给 context.csses ，那么样式将会被覆盖，这个覆盖不是样式的覆盖，而是 js 值的覆盖，最先渲染的组件的 css 的样式被后来渲染的组件的 css 样式所覆盖，这样是不正确的，所以一定要使用数组，而不是直接赋值

+ /src/containers/Home/index.js

```javascript
componentWillMount() {
  let staticContext = this.props.staticContext;
  if (staticContext) {
    if (staticContext) {
      staticContext.csses.push(styles._getCss());
    }
  }
}
```

+ /src/server/render.js

```javascript
export default (req, res) => {

  let context = {
    csses: []
  };

  Promise.all(promises).then(() => {
    let domContent = renderToString(
      <Provider store={store}>
        <StaticRouter context={context} location={req.path}>
          {
            renderRoutes(routes)
          }
        </StaticRouter>
      </Provider>
    );

    let cssStr = context.csses.length ? context.csses.join('\n') : '';

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
  <title>react-ssr</title>
  <style>${cssStr}</style>
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
  });
};
```

+ 这样，快速刷新浏览器，页面也不会抖动，禁用掉 js ，页面样式依然存在
+ 我们可以查看一下页面源代码，我们可以发现，css 的源代码，就在 style 标签里

# 2. 封装样式组件
+ 如果我们有多个页面，每一个页面都有自己的 css 样式，那么我们就要在每一个组件里都要写 componmentWillMount 钩子函数，在这个函数里把 css 样式传递到 staticContext 里，这样明显不是一个好的办法，所以我们可以封装一个高阶组件
+ 我们封装一个 WithStyle 的高阶组价，把原组件和样式作为参数传递给高阶组件

```javascript
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
```

+ 在 Home 组件里使用这个高阶组件

```javascript
import WithStyle from '../../withStyle';

export default connect(mapStateToProps, mapDispatchToProps)(WithStyle(Home, styles));
```
+ 这样，我们就可以把样式相关的功能作为高阶组件封装起来，提高代码的复用率

# 3. 优化组件
+ 我们在 Home 组件里定义了一个静态方法 loadData，这个方法是在 Home 组件下的，但是我们使用了 WithStyle 高阶组件对 Home 组件进行了包装，那么我们在导出的组件，就不再是 Home 组件了，这样会有一些潜在的问题，就是导出的组件没有 loadData 方法，那么我们在使用的时候就会报错，所以我们可以做一些改进
+ 我们重新定义个 ExportHome 的变量，这个变量是各个高阶组件包装后的返回值，在 ExportHome 组件上定义 loadData 方法，这样就可以保证导出的组件一定有 loadData 方法
+ 之所以我们之前使用 connect 包装之后没有报错，是因为 connect 自动帮我们做了转换，已经把 loadData 方法挂载到导出的对象上了，所以没有报错

```javascript
const ExportHome = connect(mapStateToProps, mapDispatchToProps)(WithStyle(Home, styles));

ExportHome.loadData = store => store.dispatch(UserActions.getSchoolList());

export default ExportHome;
```

+ 所以，这是一个需要注意的点

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
