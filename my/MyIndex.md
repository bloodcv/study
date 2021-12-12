# 【React_base】

## 简介
- React 是一个用于构建用户界面的 JAVASCRIPT 库，主要是构建 UI 界面。大多数人认为 React 属于 MVC 中的 V，起源于 FaceBook 的内部项目，最初是用于 Instagram 网站的构建，于 2013 年 5 月 开源。

React 拥有较高的性能，代码逻辑简单，越来越多的人开始使用，国内 Vue 用的多，国际上 React 使用的比较广泛

1. 声明式设计 - 采用声明范式， 可以轻松描述应用
2. 高效 - React 构建了虚拟 DOM 进行操作，减少了和真实 DOM 的交互
3. 灵活 - React 能够与多种的库或框架交互，结合使用
4. JSX - JSX 是 Javascript 的拓展，React 采用 JSX，不一定使用这个，但是建议使用
5. 组件 - React 能够编写组件，提高代码的复用性，减少重复代码, 能够很好的应用在大项目之中
6. 单向响应的数据流 - React 实现了单向数据传输的形式, 从而减少了代码, 这也是为什么它比传统数据绑定更简单

## JSX
React 使用 JSX 来代替 javscript, JSX 看起来很像是 XML 的 JavaScript 的语法拓展, 其实就是 js 和 html 的结合书写形式
```jsx
let divTag = <div>这是jsx语法</div>;

render() {
  return divTag
}

```

## State
- 如果数据需要修改，并且页面相应数据的变化，那么数据需要写在 state 中，使用 setState 修改数据
- 详见 Click、StateTest 组件

1. this.state.xxx = ???  不能直接更改数据，无法使视图响应变化
2. setState
- 2.1 this.setState(obj) obj：修改后的数据对象
- 2.2 this.setState(obj, callback) obj：修改后的数据对象；callback：修改完数据后的回调
- 2.3 this.setState(preState => { ... }) preState: 修改前的state值；需要返回新的需要修改的state的数值

## 组件
- 类组件 this.props.xxx; 有交互且需要维护state数据
- 函数组件  props.xxx;无需维护state，对外界无影响等

## props
- 父子组件间的属性传值，通过props进行
- 见 app.js 和 index.js 之间 title 的传值交互

## 条件渲染、循环、绑定事件
## 组件化
- 详见购物车实现代码

## 生命周期


