## reference
- [概括版](https://www.jianshu.com/p/247047782a09)
- [细化版](https://zhuanlan.zhihu.com/p/443964387)

## 构建流程
- 1. 初始化参数
> 从配置文件 `config` 和 `shell` 命令中 读取配置 合并为最终参数 `options`

- 2. 开始编译
> 根据参数 `options` 初始化 `Compiler` 对象，加载并配置插件，进行插件的初始化

- 3. 确定入口
> 根据 `entry` 配置找到入口

- 4. 编译模块
> 从入口出发，找到所有文件的依赖文件，并根据 `loader` 配置对所有文件进行翻译

- 5. 完成模块编译
> 得到每个依赖文件翻译后的最终内容和相互间的依赖关系

- 6. 输出资源
> 根据依赖关系和插件功能，将每个模块进行分包得到 `chunk`, 将每个 `chunk` 生成单独的文件添加到文件列表（这是能修改输出内容的最后机会）

- 7. 输出完成
> 确定好输出内容后，根据输出路径和文件名，将每个文件写入文件系统

- 8. 流程中
> 在执行过程中，特定的生命周期，`webpack` 会有相应的api钩子，每个插件会在其内部调用api执行相关的操作，改变运行结果

## loader && plugin

### loader

#### 描述
> 是一个翻译器, 将指定后缀的文件内语言转换成需要的语言（ts->js, less->css等），最后一个 loader必须是输出js（浏览器识别的语言）

#### 常用loader
- `url-loader`， `file-loader`
> 图片处理,小于阈值转base64 大于的交给file处理

- `image-loader`
> 加载并压缩图片文件

- `babel-loader`
> es6 -> es5

- `ts-loader`
> ts -> js

- `sass-loader`, `less-loader`
> scss/sass -> css, less -> css

- `css-loader`
> 加载处理CSS，支持模块化、压缩、文件导入等特性

- `style-loader`
> 处理 css-loader 输出的结果，将其转换成js脚本注入到页面中

- `eslint-loader`
> 通过 eslint 检查js代码

- `tslint-loader`
> 检查 ts 代码

- `cache-loader`
> 缓存第一次启动后的loader结果，缩短后续启动的构建时间

### Plugin

#### 描述
- plugin 是webpack运行过程中插入的逻辑，通过webpack提供的hook-api在相应的阶段执行操作
- `compiler`
> webpack 启动时会生成一个 compiler 对象，包含了 webpack 的所有全局属性和配置，插件内通过compiler调用webpack的hooks执行操作
> webpack 启动后 new生成插件的实例 传入相关配置进行插件初始化，并通过插件内apply方法 传入compiler，使插件连接上webpack主环境
- `compilation`
> compilation 代表了一次资源版本构建，当有新的文件变化时候，会生成一个新的compilation,包含了当前模块资源，编译后的资源，以及他的追踪依赖信息，compilation也提供了很多hooks供插件内在合适的时机调用

#### 常用plugin
- `html-webpack-plugin`
> 生成一个根html文件，如果有模板则根据模板生成，再将打包生成的js等模块文件 引入到html中

- `clean-webpack-plugin`
> 删除构建生成的文件夹

- `mini-css-extract-plugin`
> 将生成的css 抽离出来生成单独的文件

- `webpack-merge`
> 支持 webpack 公用配置抽离，方便做不同环境的文件配置

- `HotModuleReplacementPlugin`
> 热更新模块

## 构建优化
- JS压缩
> 自动

- CSS 压缩
> `optimize-css-assets-webpack-plugin` 默认压缩引擎： `cssnano`
> webpack5 -  `css-minimizer-webpack-plugin`

- 图片压缩
> `image-webpack-plugin` 在 file-loader 之后写

- 图片处理
> `url-loader`， `file-loader` 
> 小于阈值转 base64 大于的交给file处理

- 整合配置文件
> `webpack-merge`

- 多线程处理编译过程提高编译速度
> `thread-loader`
> 通过 将耗时的 loader 放在一个独立的 worker 池中运行，加快 loader 构建速度

- 预先编译模块
> `Dllplugin`

- 缓存 loader 结果
> `cache-loader` 缓存第一次启动后的loader结果，缩短后续启动的构建时间

## 代理 proxy
```js
/* proxy工作原理实质上是利用http-proxy-middleware 这个http代理中间件，实现请求转发给其他服务器 
在开发阶段， webpack-dev-server 会启动一个本地开发服务器，所以我们的应用在开发阶段是独立运行在 localhost 的一个端口上，而后端服务又是运行在另外一个地址上。所以在开发阶段中，由于浏览器同源策略的原因，当本地访问后端就会出现跨域请求的问题。

解决这种问题时，只需要设置webpack proxy代理即可。当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地

在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域行为，这时候浏览器就能正常接收数据。

注意：服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制
*/
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
app.listen(3000);

// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar

```

