# 核心概念
> redux 、 mobx 都是为状态管理而生，为了结合 react ，两个和 react 并无关联的库，通过 react-redux、mobx-react 作为桥梁，在 react 中完美运行。状态管理是一个抽象的概念，在一个 react 组件中，state 可以在组件内声明，也可以在父组件中定义，还可以通过 createContext 从外部接收，这些都是状态管理的方式。对于这种框架自带的状态管理方式，会因开发者的风格不同而大相径庭---对大型项目的维护和迭代是很不利的。但不管是哪种状态管理的方式，主线是一致的，提取出主线如下：
  - 创建 state
  - 注入 state
  - state 改变 触发界面更新（rerender）

## 主要涉及

### redux && react-redux
```js

  // redux
  store = createStore(reducer)
  store.dispatch(action)
  store.getState()
  store.subscribe(listener)
  combineReducers
  bindActionCreators(actionCreator, dispatch)
  redux-thunk

  // react-redux
  connect(mapStateToProps, mapDispatchToProps)(App)
  Provider + context
  // hook 版本：
  useSelector
  useDispatch

```

### mobx && mobx-react
> mobox-react 依赖于 mobx-react-lite，mobx-react-lite 是应用于函数式组件的 mobx 库，也可以单独引用。mobx-react 既可以用于 class 式组件，也可以用于函数式组件。如果只是用 hook 相应的接口，可以只导入 mobx-react-lite。

```js
// mobx
observable
reaction
autorun
computed
action
flow
...
// mobx-react:
observer
inject
Provider + context
// hook 版本：
// 关注废弃中的接⼝ https://www.npmjs.com/package/mobx-react-lite
useLocalObservable // useLocalStore 已经宣告废弃中，直接学习 useLocalObservable
Observer
```




## redux

### 原理

> redux 推崇单向数据流，状态的 immutable。状态只能通过 store 派发，UI 层响应，不能反过来。状态的更新只能通过 action --> reducer ,替换原有的状态，而不是修改原来的状态。回顾状态管理的主线（1.创建 state 2.注入 state 3. UI 层响应数据变更），使用 redux 来实现这个过程。

## mobx

> mobx 推崇数据响应式，状态的 mutable 。即状态创建后，后续都是在修改这个状态，基于代理拦截数据的
setter，从⽽触发副作⽤（在 react 中，包括 render 也可认为是 mobx 的副作⽤回调）。
- 1. 在 react 中使用 mobx 的时候，你应该忘记 react 自带的组件更新方式，时刻牢记这句话，否则使用 mobx 将
失去价值，甚至引入 bug！
- 2. 不要随意解构或使用基本类型的变量代替代理对象的属性，下文将演示这样导致的问题。
- 3. 出于优化的目的，列表的每一项尽量封装为组件，这样 mobx 将会尽情出体现它的速度！
