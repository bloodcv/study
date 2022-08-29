# 前言

> react fiber 从 0 - 1 的实现
> 本文包含：
  - `createElement` 虚拟节点生成
  - `requestIdleCallback` 模拟 `schdule` 调度器 实现空余时间执行代码
  - `fiber` 碎片化 实现同步到异步的升级
  - `reconsiler` 协调器 diff 算法
  - `commit` , `render` 合并提交修改，渲染dom
  - `Function Component` 函数式组件处理以及 `Class Component` class 组件包装
  - `hooks useState`  hooks useState 实现
> 基于源码，抽离出核心内容实现，具体细节可以查看源码研究

# JSX & createElement

> React 支持 JSX 原来需要 借助 JSXTransformer 库，后来 JSX 的转换工作集成到了 bable 中（[bable提供的转换预览功能](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=ATCCAd2BeYAoBQIQB4AmBLAbgPic1ACwEZgM1oAiAFw2oBsBTSnAFTqZQHoSdgUAhsEIAnRgDMqADxksAUgFcAtuG4CcAb0rBKAX3wEUAZ0YBjWgHsAdngIEtO_XeQpwfUCNqmm_Lm4d6Bi5cJuYY1pragYZcmLj4AJQA3EA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=true&targets=&version=7.18.13&externalPlugins=&assumptions=%7B%7D)）
> 转换后发现 createElement 支持以下参数

1. type： 节点类型(原生html标签，组件标签-如果组件小写命名则会被当做是原生标签所以react组件需要大驼峰命名)
2. config: 节点属性
3. children：子元素，可以有多个

# 通过createElement创建虚拟节点并通过render渲染 看看createElement做了什么

```js
  import React from 'react';
  import ReactDOM from 'react-dom/client'; 

  const element = React.createElement(
    'div',
    {
      title: 'hello',
      id: 'sky'
    },
    '成功啦',
    React.createElement(
      'a',
      {
        class: 'is-a-tag'
      },
      '我是a标签'
    )
  )

  const container = document.querySelector('#root')
  
  // 打印出来看看结构
  console.log('element', element)
  const root = ReactDOM.createRoot(container);
  root.render(element);
```

> 可以发现 createElement 根据入参创建了虚拟节点并返回
> react 是数据到视图的模式 createElement 提供了数据 render 将数据转换成视图

# 接下来我们自己实现 createElement & render

`MyReact/createElement.js`

```js
  function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        // 对 children 类型进行判断处理  如果是字符串就处理成字符节点 如果是对象就正常返回
        // children也要放到props里面去，这样我们在组件里面就能通过this.props.children拿到子元素
        children: children?.map(child => typeof child === 'object' ? child : createTextElement(child))
      }
    }
  }

  function createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: []
      }
    }
  }

  export default createElement;
```

`MyReact/render.js`

```js
function render(element, container) {
  // 根据节点类型 创建对应的真实dom节点
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // 给生成的dom节点挂载当前虚拟节点的属性 过滤掉children属性
  const isProperty = (key) => key !== "children";
  Object.keys(element?.props)
    .filter(isProperty)
    .forEach((key) => (dom[key] = element.props[key]));

  // 将当前节点的子节点塞入当前节点中  递归处理子节点
  element?.props?.children?.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

export default render;
```

`MyReact/index.js`
```js
import createElement from "./createElement";
import render from "./render";

const MyReact = {
  createElement,
  render,
}

export default MyReact;

```

`src/index.js`

```js
// 引入自己的
import MyReact from "./MyReact";

const element = MyReact.createElement(
  'div',
  {
    title: 'hello',
    id: 'sky'
  },
  '成功啦',
  MyReact.createElement(
    'a',
    {
      className: 'is-a-tag'
    },
    '我是a标签'
  )
)

const container = document.querySelector('#root')

console.log('element', element)
MyReact.render(element, container);
```

# 问题

> 在上述实现中render中采用递归处理（react16以前），如果虚拟dom树很庞大，那么这个递归的过程就会很久，打断了或者阻塞了浏览器的渲染等，会产生明显的卡顿
> 此时需要把这个过程拆分成一个个小的任务单元进行处理（react16.8开始fiber的引入）
