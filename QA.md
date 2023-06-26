# QA

## Vue 和 React 异同
  1. 相似之处
    - 1.1 注意力保持在核心库，将路由和全局状态管理交给其他相关的库
    - 1.2 都有自己的构建工具 能够快速得到一个最佳时间的项目模板
    - 1.3 都使用了虚拟dom提高渲染性能
    - 1.4 都有props的概念允许组件间的数据传递
    - 1.5 鼓励组件化应用，将引用拆分成一个个功能明确的模块，提高复用性
  2. 不同之处
    - 1.1 数据流
      Vue：双向数据流
      react： 单向数据流
    - 1.2 虚拟dom
      vue：渲染过程中，会跟踪每个组件的依赖关系，不需要重新渲染整个组件树
      react： 应用状态改变的时候，全部子组件都会重新渲染，可以通过pureComponent/shouldComponentUpdate 优化
    - 1.3 模板语法
      vue：类似html  采用的事template 增加了一些属性 v-xxx on-xxx
      vue使用组件需要挂在this上中转所以import完了要在component中声明
      react: 采用jsx语法
      render支持闭包特性 所以import的组件可以在render中直接调用
    - 1.4 监听数据变化的实现原理不同
      vue：defineProperty  getter setter进行数据劫持，能精确制导数据变化不需要特别的优化
      react：通过比较引用的方式进行，不优化可能会导致不必要的渲染

      因为vue数据可变，react强调数据的不可变性
    - 1.5 高阶组件
    react：可以通过高阶组件hoc拓展
    vue: 需要通过mixin拓展
    高阶组件就是高阶函数，react组件本上就是纯粹的函数，所以告诫组件对于react来说很容易实现
    而vue使用html模板实现组件，模板无法有效的编译所以不同通过hoc实现
    - 1.6 构建工具
    vue：vue-cli
    react：create-react-app
    - 1.7 跨平台
    react：react native
    vue: weex

## 说说CRM项目
  1. 项目构成
    - 管理订单流转信息：下单、退款、客诉
    - 维护用户信息：用户级别、个人信息、历史订单信息、当前课程进度
    - 营销收入记录：从每天每人、每组每期及再往上维度的营销情况统计
    - 班主任排班及期次管理：期次配置、班主任池子和期次池子的分配处理
  2. 技术难点： 排班期次维护
    - 期次下活动配置：
      - 级联多选，父子级皆可选，确定选择后采用树形表格展示选中项，且已选中项需要过滤，表格中选中项可删除
        - 技术实现：
          - 1. 数据维护：表格数据用map维护 key是父级 value是子级map集合
          - 2. 过滤逻辑：遍历选中项 是子集则根据选中项所属父级去map找对应父级的子级集合 利用map快速定位是否已经选过
                                是父集则根据选中项去map找对应父级 利用map快速定位是否已经选过
          - 3. 删除逻辑：删除子集 根据选中项所属父级去map找对应父级的子级集合 删除对应子集
                       删除父集 根据选中项去map找对应父级 删除对应父集
    
    - 渠道配置：
      - 级联多选 父子级皆可选 有多个渠道  一样的级联数据 但不同的渠道选择的数据需要互斥并提示互斥项和所属渠道 选择非叶子结点需要获取该节点的所有叶子结点进行存储
        - 技术实现：
          - 1. 若直接采用一个渠道一个级联选择框，则需要控制多渠道数据在每个级联选择里面的禁用项
          - 2. 提出方案：采用一个级联选择框  每一项前面自定义一个+号  点击加号添加  定义渠道下拉选择框 表示当前数据要加入的渠道分组
          - 3. 数据维护：
            - 3.1 每个渠道一个map  一个总的map(key是节点id value 是节点内容 添加一个所属渠道的属性)
            - 3.2 添加：选中级联数据后 获取所有叶子结点遍历去总map中查找是否已添加过 并存储渠道-已添加节点集合A  未添加过的对两个map更新  已添加过弹窗提示
            - 3.3 删除： 删除节点/删除渠道 更新两个map
          - 优点：共用一个级联下拉框  无需维护级联下拉框中的数据 级联下拉框只需要生成一次

## 网站攻击的几种形式和如何防御
1. xss 跨站脚本攻击
  - 脚本注入
    - 1. 输入框输入脚本提交 进行攻击 可以攻击数据库
    - 2. 评论区或者发帖内容注入脚本 让每一个浏览到该帖子或者评论的人都会走恶意脚本 可以获取身份
  - 防御
    - 输入验证
    - 后端对文本进行校验
    - https 禁止恶意代码注入
2. csrf 跨站请求伪造
  - 通过引导链接、iframe等获取cookie等信息 在隐藏的页面或新的页面进行冒用身份
  - 通过xss获取cookie等信息 再自己通过代理等形式去恶意访问
  - 防御
    - 设置token
    - 设置同源才相应请求
    - 设置samesite 禁止cookie被第三方使用

## webpack 构建流程
  - 1. 合并命令 config 和 shell命令合并 得到最终初始化参数
  - 2. 初始化compiler && 插件
  - 3. 根据entry 确定入口文件
  - 4. 根据文件之间的相互引用确定依赖关系 并通过loader进行文件编译
  - 5. 得到最终的编译结果及各个文件的依赖关系
  - 6. 根据文件的依赖关系和编译结果，通过插件对文件进行分chunk，写入文件列表
  - 7. 根据输出配置 将chunk文件命名并写入对应的文件夹
  - 8. 整个过程中，各个生命周期会触发plugin中调用的勾子回调执行操作

## webpack loader plugin
  ### 异同
    - 相同点
      - 1. 都是对文件进行处理
    - 不同点
      - 1. loader是在文件内容层面进行处理：语法转换、删除log、scss转css、px转rem、压缩文件等等
      - 2. plugin是在文件架构层面进行处理：文件分割、将文件代码插入到指定位置、文件输出到指定文件夹等等
  ### loader
    #### 执行顺序：从上到下 从右至左
    #### 书写形式
      - 函数：接受source 表示文件源码，可以使用getOptions获取参数，可以对源码进行读写 返回改造后的代码片段
    #### 常见
      1. css-loader
      - 压缩css、分析css文件之间关系进行整合
      2. style-loader
      - 将css代码挂载到html的header部分
      3. scss-loader、less-loader
      - scss/less --> css
      4. url-loader、file-loader
      - 图片处理，小于阈值的转base64（url-loader）; 大于阈值的交给file-loader处理，指定资源放置位置，改变引用路径等
      5. image-loader
      - 压缩图片文件
      6. babel-loader
      - es6 --> es5
      7. cache-loader
      - 缓存编译后的文件，提高后续的构建速度
      8. eslint-loader
      - eslint代码检查
      9. ts-loader
      - ts --> js
  ### plugin
    #### 执行顺序：无 生命周期勾子触发
    #### 书写形式
      - Class 定义一个类
      - 类里面定义一个apply方法 接收Compiler参数（webpack调用生命周期勾子的一个对象）
      - 在对应勾子里面写对应生命周期的回调执行
    #### 常见
      1. html-webpack-plugin
      - 根据模版html 根据配置将js css等引入插入html中生成最终的html
      2. clean-webpack-plugin
      - 打包后删除原来的打包目录
      3. webpack-merge
      - 支持webpack配置不同环境分文件编写并进行整合
      4. SplitChunksPlugin
      - 对公共代码进行提取生成公共引入文件 根据依赖关系分割文件生成模块对应的chunk 按需引入文件
      5. mini-css-extract-plugin
      - 抽离css为单独的文件
      6. DLLPlugin
      - 将三方库单独打包
      7. HotModuleReplacementPlugin
      - 热更新
      8. UglifyPlugin
      - Js压缩

## 浏览器性能优化指标怎么看
  - [传送门](https://blog.csdn.net/ywCSD/article/details/111614275)
  > 蓝色(Loading)：表示网络通信和 HTML 解析时间。
  > 黄色(Scripting)：表示 JavaScript 执行时间。
  > 紫色(Rendering)：表示样式计算和布局（重排）时间。
  > 绿色(Painting)：表示重绘时间。
  > 灰色(other)：表示其它事件花费的时间。
  > 白色(Idle)：表示空闲时间。

  总览图包含 FPS（每秒帧数情况）、CPU（CPU占用情况）、NET（网络资源情况）、HEAP（JS占用情况）一共四项指标
  Timings：上图中有 4 条虚线，分别表示如下。
（1）DCL（DOMContentLoaded）表示 HTML 文档加载完成事件。当初始 HTML 文档完全加载并解析之后触发，无需等待样式、图片、子 frame 结束。作为明显的对比，load 事件是当个页面完全被加载时才触发。
（2）FP（First Paint）首屏绘制，页面刚开始渲染的时间。
（3）FCP（First Contentful Paint）首屏内容绘制，首次绘制任何文本，图像，非空白canvas 或 SVG 的时间点。
（4）FMP（First Meaningful Paint）首屏有意义的内容绘制，这个“有意义”没有权威的规定，本质上是通过一种算法来猜测某个时间点可能是 FMP。有的理解为是最大元素绘制的时间，即同LCP（Largest Contentful Paint ）。
其中 FP、FCP、FMP 是同一条虚线，三者时间不一致。比如首次渲染过后，有可能出现 JS 阻塞，这种情况下 FCP 就会大于 FP。
（5）L（Onload）页面所有资源加载完成事件。
（6）LCP（Largest Contentful Paint ）最大内容绘制，页面上尺寸最大的元素绘制时间

## 浏览器缓存
  ### 强缓存
  1. expires
    - 设置过期时间 res.setHeader('Expires', new Date('2023-5-15 12:00:00').toUTCString())
  2. cache-control
    - 设置过期时间 res.setHeader('Cache-Control', 'max-age=30')
    - 这个优先级比expires高
    - no-store表示不走缓存 每次都向服务器请求新资源
    - no-cache表示走协商缓存
  ### 协商缓存
  1. Last-Modified --- if-Modified-since 走时间 最小间隔1s
    - 请求头带 if-Modified-since
    - 响应头带 Last-Modified
  2. Etag --- if-none-match 走修改hash
    - 请求头带 if-none-match
    - 响应头带 Etag
  3. 走hash优先级大于走时间

## react 生命周期
  ### 16.3以前
    1. 挂载阶段
      - componentWillMount
      - render
      - componentDidMount
      - componentWillUnmount
    2. 更新阶段
      - componentWillReceiveProps(setState 和 父组件更新 触发)
      - shouldComponentUpdate
      - componentWillUpdate(forceUpdate触发)
      - render
      - componentDidUpdate
      - componentWillUnmount
  ### 16.3 以后
    1. 挂载阶段
      - getDerivedStateFromProps
      - shouldComponentUpdate
      - render
      - componentDidMount
      - componentWillUnmount
    2. 更新阶段
      - getDerivedStateFromProps(setState && props && forceUpdate 触发)
      - shouldComponentUpdate
      - render
      - getSnapShotBeforeUpdate
      - componentDidUpdate
      - componentWillUnmount

## 状态码
  ### 1xx
    - 请求收到了 还没处理
  ### 2xx
    - 200 请求处理完成
  ### 3xx
    - 301 永久重定向
    - 302 临时重定向
    - 303 必须临时重定向
    - 304 协商缓存生效 浏览器拿缓存资源
  ### 4xx
    - 400 语法不识别
    - 401 需要登录身份认证
    - 403 没有权限
    - 404 资源找不到
  ### 5xx
    - 500 服务器遇到错误无法完成请求
    - 502 网关错误
    - 503 服务器停机维护
    - 504 网关超时

## 性能优化能做哪些事
  ### 1.资源层面
    - CDN加速
    - http2 多路复用
    - gzip 压缩资源
    - 强缓存 协商缓存
  ### 2.构建层面
    - image-loader 图片压缩
    - splitChunkPlugin 分片打包 按需加载
    - url-loader file-loader 图片处理
    - minicssextractplugin css抽离
    - uglifyPlugin js压缩
    - cache-loader 缓存打包文件
  ### 3.代码层面
    1. css
    - 采用硬件加速: tranform、opacity、filter
    - 雪碧图
    - 公用样式抽离
    2. html
    - 减少嵌套层级
    - 使用preload预加载 defer async加载
    3. js
    - 减少嵌套循环
    - 错误捕获
    - 闭包内回收不用的变量
    4. 框架
    - 懒加载
    - 组件化开发
  ### 4.特殊
    - 提前分析项目架构，合理建立文件夹

## 说一下对promise的了解
  1. 构造函数是同步执行的
  2. then catch 属于微任务
  3. 具有三个状态 pending fulfilled rejected
    - fulfilled --> resolved
    - fulfilled --> rejected
    - 只能单向流转并只有一次
  4. 返回一个具有状态的promise
  5. 常用的内置方法有all和race  (其他的还有any 和 allSettled)
  6. 可以使用async await简化写法

## 说一下设计模式
  ### 五大原则
    1. 开闭原则
    2. 里氏替换原则
    3. 依赖倒置原则
    4. 单一职责原则
    5. 接口隔离原则
  ### 三大类型
    1. 创建型 - 三种
      - 工厂模式
      - 建造者模式
      - 单例模式
    2. 结构型 - 三种
      - 适配器模式
      - 装饰器模式
      - 代理模式
    3. 行为性 - 四种
      - 命令模式
      - 模板模式
      - 职责链模式
      - 观察者模式

## 浏览器几种刷新的区别
  ### f5 & 点击左上角刷新 & 正常重新加载
    1. 对本地的缓存文件过期
    2. 走协商缓存 带上 if-none-match if-modified-since
  ### ctrl F5刷新 & 硬性重新加载
    1. 不走缓存 不带协商缓存的头部信息 重新请求资源
  ### 清空缓存并硬性重新加载
    1. 有些文件是通过js加载  彻底清空加载的资源完全的重新加载
    2. 缓存遇到未知的问题 可用
  ### 地址栏回车 
    1. 先走本地缓存查验
    2. 再走协商缓存查验



## 要问的问题
  ### 是普联TPlink  还是  联洲TPlink 
    - 属于内销还是外销呢
  ### 发布周期您这边清楚吗
  ### 上下班时间一般是什么样的
  ### 加班强度如何
  ### 年终奖是几薪
  ### 调薪政策
  ### 工资是每月的什么时间点发
  ### 有商业保险吗
