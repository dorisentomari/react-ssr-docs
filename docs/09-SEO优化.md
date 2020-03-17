# 1. SEO优化
+ 搜索引擎优化`Search engine optimization`
+ 搜索引擎分析网站的时候，搜集网站的全部内容，进行分析，然后得出一个主题，这个主题，就是搜索关键词
+ title 标签和 meta 里的 description 的真正作用是提高网站的转化率，不在于 SEO 优化
+ 网站的三部分：文字，链接和媒体。文字的原创；链接的相关性，外部链接越多，网站的欢迎程度越好；图片的原创，高清

# 2. 使用 react-helmet 进行 SEO 优化
## 2.1 客户端使用
+ Home 页面

```javascript
// src/client/Home/index.js
import {Helmet} from 'react-helmet';

class Home extends Component {
  render() {
    return (
      <>
        <Helmet>
          <title>hello, Home</title>
          <meta name="描述" content="这是 Home 页面" />
        </Helmet>
        <div className={styles.wrapper}>
        </div>
      </>
    );
  }
}
```

+ News 页面

```javascript
// src/client/News/index.js
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
```

## 2.2 服务端使用
+ src/server/render.js

```javascript
// src/server/render.js
import { Helmet } from 'react-helmet';

export default (req, res) => {
  Promise.all(promises).then(() => {

    const helmet = Helmet.renderStatic();

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
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
