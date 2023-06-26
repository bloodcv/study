# prepare
## 1 promise 手写
## 2 vite手写
## 3 webpack 手动搭建
  ### plugin 实现
  ### loader 实现
  ### webpack 跑起来全流程过一遍
## 4 设计模式
## 5 vue 原理过一遍
## 6 react 原理过一遍
## 7 redux 手写
## 8 vue3  vue2 区别
## 9 闭包
## 10 算法 做几个middle
## 11 性能优化
## 12 虚拟列表实现
## 13 diff算法查看
## 14 实现虚拟dom
## 15 浏览器原理过一遍
  ### http https(SSl/TLS)
  ### 输入网址到展示全过程
  ### http1  http2 
  ### http 请求状态码
  ### http 请求头有哪些属性
  ### 浏览器进程 线程 eventloop
  ### web 攻击 XSS CSRF
## 16 准备几个项目中遇到的问题
## 17 自我介绍
## 18 react hook
## 19 面向对象 继承 原型链 this


## node-server

## SDK
  ### 初始化
  
  - 状态机

## 小程序
  ### 破坏性更新有哪些
## 支付
  ### 微信和支付宝之间的差异
  ### api
## 微信
  ### 一些基础概念  各种id [quto](https://blog.csdn.net/liubangbo/article/details/119170186)
  - UnionID
  - AppID
  - OpenID
  - 原始ID
  - 登录和授权
  ### [微信推送的相关限制](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/template-message.html)
  1. 支付:  当用户在小程序内完成过支付行为，可允许开发者向用户在7天内推送有限条数的模板消息（1次支付可下发3条，多次支付下发条数独立，互相不影响）
  2. 提交表单:  当用户在小程序内发生过提交表单行为且该表单声明为要发模板消息的，开发者需要向用户提供服务时，可允许开发者向用户在7天内推送有限条数的模板消息（1次提交表单可下发1条，多次提交下发条数独立，相互不影响）
## 遇到的一些问题
  ### 穿透
  - 滚动穿透
    > h5
    > 1. 底部设置`定高，fixed`
    > 2. 底部设置`overflow hidden`
    > 小程序
    > 1. `scroll-view` 设置`scroll-x scroll-y false`
    > 2. 蒙层有滚动条：可以和h5 一样处理 也可以用scroll处理
    > 3. 蒙层没滚动：`catchtouchmove true`
  ### 键盘遮挡或顶起（什么情况上移，什么情况遮盖）
  - [输入框被顶起](https://www.csdn.net/tags/MtjacgxsNzU2MTItYmxvZwO0O0OO0O0O.html)
  - [被遮挡](https://juejin.cn/post/7057444667238907934)
  - ios
  > [会被顶起](https://blog.csdn.net/AliceWu_1111/article/details/80930810)
  > 监听输入框的blur、focus 进行滚动到对应位置
  - [Android](https://blog.csdn.net/liu_yunzhao/article/details/100128352)
  > 1. 遮挡input
  > 项目中,点击输入框的时候,弹出来的键盘挡住了输入框,输入框不在可视区域里面,主要解决代码,加个监听来看是否点击了输入框,滚动到可视区域
  > `Element.scrollIntoView()`方法让当前的元素滚动到浏览器窗口的可视区域内。而`Element.scrollIntoViewIfNeeded()`方法也是用来将不在浏览器窗口的可见区域内的元素滚动到浏览器窗口的可见区域。
  ```js
    window.addEventListener('resize', function () {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded()
        }, 0)
      }
    })
  ```
  > 2. 顶起底部固定元素
  >   1. 在mounted中添加对resize屏幕变化监听并获取到屏幕原始高度
  >   2. 在watch中添加对data中定义的屏幕高度的监听, 小于原始高度底部布局就隐藏，否则就显示
  >   3. 在beforeDestroy中删除对resize屏幕变化的监听
  > 3. 调出软键盘，屏幕背景图被压缩
  >   1. app.vue
  ```js
    created() {
        var height= document.documentElement.clientHeight; //获取当前可视区域的高度
        window.onload = function(){ //在页面整体加载完毕时
            document.getElementById('app').style.height= height + 'px'//给根布局设置高度
        }
    }
  ```
  ### 菜单切换，border导致抖动
  > 菜单切换的时候给某一个菜单项目增加border 其他的会被挤兑抖动一下
  > 1. 可以全都加上border，其他的用透明色
  > 2. 可以套一层有border的div在外面占位展示
  ### 1px问题
  > [原理](https://zhuanlan.zhihu.com/p/535456539)
  > [解决方式](https://zhuanlan.zhihu.com/p/379257752)
  > 1. -webkit-box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);
  > 2. 先放大200% 边框不会被放大，再scale(0.5)
  ### [img下方出现小缝隙的问题](https://blog.csdn.net/q1105441883/article/details/116117066)

  > 为什么会出现这种情况呢？
  > 因为img是一种类似text的标签元素，在结束的时候，会在末尾加上一个空白符（匿名文本），导致下方会多出来 3px间距，其实我们在img右侧添加一个span包裹住文本，现象会更明显

  下面我们来解决这个问题

  1. 第一种方法：

  给div设置和img一样的高度；

  缺点：该方法不够灵活，一旦img尺寸改变，我们要重新设置div的高度

  2. 第二种方法：

  给img设置vertical-align为除baseline以外的值。

  3. 第三种方法：

  给img添加display:block;

  这个方法是我们比较常用，但需要注意，img一旦设置为块，text-align:center；就不再生效，图片的水平居中应使用margin:auto;

  4. 第四种方法：

  给img设置浮动，设置浮动会让img脱离文档流

  缺点：父元素高度不会被img自动撑开

  5. 第五种方法：

  给div设置font-size:0;

  缺点：该方法会使div中的文字消失

## vue，react 各种差异对比
## 微前端实现的了解

# 补充
## vue3 ref  reactive 区别
## scoped 实现原理
## new关键字做了什么
## 劫持监听怎么实现
## 数组去重有哪些方法
## script 中 async 和 defer
  - script标签内未设置async或者defer时：
  1. script放在<head>，会阻塞HTML代码的解析和渲染，而放在<body>底部时，不会阻塞HTML代码的解析和渲染。
  2. script放在<head>，将无法操作HTML元素，而放在<body>底部时，可以操作HTML元素。
  3. script放在<head>，无法通过脚本改变内联的CSS样式，而放在<body>底部时，可以通过脚本改变内联的CSS样式
  - script标签内设置async时：
  > 当script脚本加载完毕后，script脚本会立即执行，此时会阻塞HTML代码的解析和渲染，并且是哪个先下载完执行哪个；
  - script标签设置defer时：
  > 当script脚本加载完毕后，script脚本不会立即执行，会等待HTML代码的解析和渲染结束后并安装顺序再执行；
  - defer与async的共同点是：
  > script放在<head>和放在<body>底部时没区别。script脚本会异步加载，在加载过程中不会阻塞HTML代码的解析和渲染；
  - defer与async的区别是：
  > defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；
  > async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。
  > defer是“渲染完再执行”，async是“下载完就执行”。
  > 另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的；
  - 注意：如果同时指定了两个属性，则会遵从async属性而忽略defer属性

# 查漏补缺
## webpack打包细节了解
## vue2 原理 react fiber
## diff 算法
## 性能优化
## 准备一个项目和难点
## 性能监控  错误监控
## 跨域处理
## 算法准备
## 常规css题

## [23-3月面经-前端常考JS编程题](https://juejin.cn/post/7223046446941110328?)

Mozilla/Firefox : 归并排序（jsarray.c 源码）
V8 ：数组长度小于等于 22 的用插入排序，其它的用快速排序（array.js 源码）见下面注释

// In-place QuickSort algorithm.
// For short (length <= 22) arrays, insertion sort is used for efficiency.
Webkit ：底层实现用了 C++ 库中的 qsort() 方法（JSArray.cpp 源码）