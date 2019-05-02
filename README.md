# 1. react-ssr-docs

+ 这个仓库是关于 react 服务端渲染的使用介绍，从 webpack 的基础配置到最后项目成型，都有非常完整详细的介绍，并附带有源代码

# 2. 技术栈

+ 基本上是完全使用了 react 全家桶，后端采用的是 Express
+ react/react-dom
+ react-router-dom/react-router-config
+ redux/redux-thunk/react-redux/redux-logger
+ express
+ webpack@4.x
+ babel@7.x

# 3. 项目目录

```
├── node_modules/   第三方依赖包
|── build/  服务端打包后生成的代码
|   └── server.js 
├── public/  	客户端打包后生成的代码
│   └── client.js
├── src
│   ├── client/		客户端源代码
│   ├── components/		React 组件
│   ├── containers/		React 容器组件
│   ├── server/		服务端源代码
│   ├── store/		redux
|	  └── routes.js     路由
├── .babelrc		babel 编译
├── .gitignore		git 忽略文件
├── package.json
├── webpack.base.js		webpack 基础配置
├── webpack.client.js		webpack 客户端配置
└── webpack.server.js		webpack 服务端配置
```

# 3. docs 文档链接

+ [01-项目基础架构搭建](https://github.com/dawnight/react-ssr-docs/blob/master/docs/01-%E9%A1%B9%E7%9B%AE%E5%9F%BA%E7%A1%80%E6%9E%B6%E6%9E%84%E6%90%AD%E5%BB%BA.md)

+ [02-最简单的服务端渲染](https://github.com/dawnight/react-ssr-docs/blob/master/docs/02-%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93.md)

