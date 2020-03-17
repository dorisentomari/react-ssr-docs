# 1. 服务端异步获取数据(最难最复杂)
+ 刚才我们用了客户端的同步和异步，其实还是比较简单的，因为用法与客户端渲染的用法基本上一模一样，差别很小
+ 但是服务端异步获取数据修改 store，这个是非常复杂的，我们要首先明白这其中的原理

## 1.1 服务端怎么知道它要获取数据
+ 服务端异步获取数据的前提是，服务端需要知道它要去获取什么数据，就像是去餐馆吃饭，你是客人，厨师肯定不知道客人要吃什么，所以一定要客人告诉厨师，我要吃什么。这里的客人就好比是客户端，厨师好比是服务端
+ 所以，客人告诉厨师，我要吃蛋炒饭，厨师知道了你要吃蛋炒饭，就开始给你做饭。这里就是客户端告诉服务端，客户端需要什么数据(客人要吃什么)，然后服务端知道了客户端需要什么(客人要吃蛋炒饭)，然后服务端去获取客户端需要的数据(厨师去做蛋炒饭)，最终返给客户端(把蛋炒饭端给客人)

## 1.2 客户端怎么告诉服务端它需要数据
+ 但是现在问题又来了，客人怎么告诉厨师他要吃什么，客人是点外卖，还是打电话，还是直接去店里吃呢？客人怎么告诉厨师这个方法，就好比是客户端怎么告诉服务端，客户端需要什么数据，所以这里的关键就在于，客户端通过什么方式把它需要的东西，告诉服务端
+ 通过什么方式传递呢？我们现在客户端和服务端所共有的有 redux 和 router，能通过路由传递吗？肯定不行，路由主要是做路由跳转的，路由能够传递参数是可以，但是要让路由去传递大量的数据，并且要对数据进行多次的修改，这显然不合适，所以我们最好的选择依然还是 redux
+ 好，我们已经确认了要使用 redux 这个方式来告诉厨师，客人要吃什么。也就是客户端使用 redux 告诉服务端，它需要什么数据，接下来就需要调用 redux 里的方法
+ 我们可以给组件添加一个静态方法，因为组件就是类，类就有自己的静态方法，我们定义一个 loadData 的静态方法，在这个静态方法里，通过 redux 告诉服务端，客户端需要什么数据，我们以 Home 组件为例，Home 组件现在有一个客户端异步获取 schoolList 的方法，我们让服务端调用这个方法

+ Home/index.js

```javascript
Home.loadData = store => store.dispatch(UserActions.getSchoolList());
```

+ 可以看到，我们给 Home 定义了一个 loadData 的静态方法，把 store 作为参数传递进去，然后 dispatch UserActions 里的 getSchoolList 方法，因为 loadData 是静态方法，只有通过类才能调用，所以就是说，我们可以自己定义这个方法是在客户端执行还是在服务端执行

## 1.3 把 loadData 方法放在路由上
+ 我们不要去考虑客户端，现在与客户端没有关系，我们只考虑服务端该怎么调用 loadData 这个方法
+ 路由，我们在 Home 这个组件的路由上边，添加一个 loadData 的方法属性，这也就解释了为什么我们上一节要把 routes.js 的形式修改成数组对象的形式，目的就是为了服务于调用 loadData 这个方法，所以我们修改一下路由
+ src/routes.js

```javascript
// src/routes.js
export default [
  {
    path: '/',
    component: Home,
    loadData: Home.loadData,
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

## 1.4 服务端怎么调用路由上的 loadData 方法
+ src/server/render.js
+ 路由上的方法定义好了之后，我们就要在使用路由的地方做一些其他的操作，首先我们看一下之前我们在服务端是如何是使用路由的，我们看一下 src/server/render.js 文件

```javascript
// src/server/render.js
<div className="container" style={{ marginTop: 70 }}>
  {
    routes.map(route => <Route {...route} />)
  }
</div>
```

+ 可以看到，我们是直接使用路由，没有对路由再做其他的任何操作，但是现在不一样了，路由里有了 loadData 这个方法，而且我们需要的是在服务端渲染 HTML 模板之前调用 loadData 这个方法，所以我们要使用这个方法，我们修改一下 src/server/render.js 里的代码

```javascript
// src/server/render.js
export default (req, res) => {

  let context = {};

  let store = getServerStore();

  let promises = [];

  routes.forEach(route => {
    if (route.loadData) {
      promises.push(route.loadData(store));
    }
  });

  Promise.all(promises).then(() => {

    console.log(store.getState());

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
  });
};
```
+ 从代码里，我们可以看到，我们主要定义了一个 promises 数组，然后把 routes 遍历，如果 routes 里有 loadData 这个属性，那么把这个 loadData push 进 promises 数组，最后统一调用 Promise.all(promises) 执行所有的 loadData，执行完毕之后，redux 里的异步方法就已经执行完毕，修改了 store，然后开始渲染 HTML 模板
+ 我们要明确一件事，就是 store 里的 action 的异步操作，我们采用的是 axios，axios 请求返回的就是一个 promise，所以我们的 loadData 在调用 action 的方法的时候，一定也是一个 promise，所以我们可以把 loadData push 进 promises 数组，最终统一用 Promise.all 执行
+ 通过控制台的输出，我们看到，现在服务端已经获取到数据了，而且也已经修改了 store 里的值，那么接下来，我们就可以使用 store 里的值了

## 1.5 脱水与注水
+ 脱水与注水，很容易让我们想到洗衣机的脱水与注水。衣服放进洗衣机的时候，肯定要注水。等衣服洗完之后，要进行脱水。
+ 在这里也是一样，服务端获取到数据后，怎么才能把数据返回给客户端，要知道服务端不能通过 ajax 的方式把数据再次返回给客户端。
+ 我们看代码就可以看到，我们是先获取到 store 里的数据，然后才开始渲染页面内容的，既然这样，我直接把 store 里的数据，放到 HTML 页面里就可以了，客户端页面渲染完之后，直接从 HTML 页面里拿数据去使用就可以了。
+ **注水**， 我们在 HTML 模板中，添加一个 script 标签，把 store 的值作为 window 对象的一个属性，挂到页面上，挂载到页面上的一定要是一个字符串，因为 HTML 页面只认识字符串，js 对象识别不了，所以，我们就实现了服务端的注水

```html
<script>
  window.context = {
    state: ${JSON.stringify(store.getState())}
  }
</script>
```

+ **脱水**，服务端注水完成了，那么该客户端脱水了，怎么脱水呢，换句话说，就是怎么把服务端挂到 HTML 页面上的 js 数据拿出来，然后修改页面视图，我们打开
+ /src/store/index.js 文件，修改 getClientStore，我们把 HTML 模板里的 window.context.state 的值获取到，然后作为 createStore 里的第二个参数，就可以实现脱水的功能

```javascript
// /src/store/index.js
export const getClientStore = () => {
  let initState = window.context.state;
  return createStore(
    reducers,
    initState,
    composeWithDevTools(applyMiddleware(thunk, logger))
  );
}
```

+ 这个时候，我们不需要修改客户端的任何代码，直接重启服务，刷新页面，我们可以看到，我们不需要点击按钮，浏览器已经把 schoolList 数据挂到页面上。我们查看页面源代码，就可以看到，ul 标签里的 li 标签里，有各个学校的内容。同时，在代码底部，有一个 script 的标签里，里边的内容就是我们在服务端的 HTML 模板里注水的内容
+ 这个时候，我们就实现了服务端异步获取数据
+ 总结一下就是，整体的代码量不多，最核心的是思路，客户端给自己定义一个 loadData 的静态方法，loadData 通过调用 redux 里的 actions 告诉服务端要获取什么数据，然后在路由里添加 loadData 这个属性，服务端调用 loadData 这个方法，本质上调用的是 redux 里的 actions 里的方法，因为可能有多个组件都有 loadData 方法，所以我们遍历出有 loadData 属性的路由，把 loadData 属性统一放入 Promise.all 里进行处理，处理完毕之后， store 里的数据已经修改，我们通过服务端的注水，客户端的脱水，就可以把服务端异步获取到的数据显示在页面上
+ 页面效果，学校列表是通过服务端渲染获取到的，不再是客户端获取数据

![页面效果](http://file.ikite.top/react-ssr/10-server-async-request-data.png)

+ 页面源码，主要是看红框里的， HTML 里已经有了各个的 school 信息，同时，服务端注水的内容，也作为字符串显示在页面上

![页面源码](http://file.ikite.top/react-ssr/10-server-async-request-data-source-code.png)

+ 由于这一节的内容比较复杂，也比较难，所以我们就介绍这么多，下一节我们主要介绍一下优化当前的代码

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
