# 1. react-ssr-docs
+ 这个仓库是关于 react 服务端渲染的使用介绍，从 webpack 的基础配置到最后项目成型，都有非常完整详细的介绍，并附带有源代码
+ 目前这只是一个 react 服务端渲染的学习文档，后期会加上一个简单的项目，用来实际体验 react 服务端渲染
+ 注: 这个项目只是用来学习 react 的服务端渲染，而非安利大家一定要使用服务端渲染，因为 react 和 vue 的服务端渲染和普通的服务端渲染有很多的不一样，所以可以学习一下，提高一下自己的水平

# 2. 技术栈
+ 基本上是完全使用了 react 全家桶，后端采用的是 Express
+ 关于版本，具体可以查看 package.json
+ react/react-dom 16.x
+ react-router-dom 5.x
+ redux 4.x
+ redux-thunk 2.x
+ react-redux 7.x
+ redux-logger 3.x
+ express 4.x
+ webpack 4.x
+ babel 7.x

# 3. 项目目录
```
├── node_modules/       第三方依赖包
|── build/              服务端打包后生成的代码
|   └── server.js
├── public/  	          客户端打包后生成的代码
│   └── client.js
├── src
│   ├── client/		      客户端源代码
│   ├── components/		  React 组件
│   ├── containers/		  React 容器组件
│   ├── server/		      服务端源代码
│   ├── store/		      redux
|	  └── routes.js       路由
├── .babelrc		        babel 编译
├── .gitignore		      git 忽略文件
├── package.json
├── webpack.base.js		  webpack 基础配置
├── webpack.client.js		webpack 客户端配置
└── webpack.server.js		webpack 服务端配置
```

# 4. docs 文档链接
+ [01-项目基础架构搭建](./docs/01-项目基础架构搭建.md)
+ [02-最简单的服务端渲染](./docs/02-最简单的服务端渲染.md)
+ [03-路由](./docs/03-路由.md)
+ [04-redux-01](./docs/04-redux-1.md)
+ [05-redux-02](./docs/05-redux-2.md)
+ [06-优化](./docs/06-优化.md)
+ [07-添加CSS样式](./docs/07-添加CSS样式.md)
+ [08-404和重定向](./docs/08-404和重定向.md)
+ [09-SEO优化](./docs/09-SEO优化.md)
