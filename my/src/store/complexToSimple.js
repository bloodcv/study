// 从复杂到简单
// 通常 mapDispatchToProps 是这样的
/* const mapDispatchToProps = (dispatch, ownProps) => ({
  // dispatch 的参数是个 action
  dispatch,
  onDecrement: (payload) => dispatch({ type: 'DECREMENT', payload }),
  onAdd: () => dispatch({ type: 'ADD' }),
}) */

// 第一次变形

// actionCreator
/* const onDecrement = (payload) => ({ type: 'DECREMENT', payload })

const onAdd = () => ({ type: 'ADD' })

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatch,
  onDecrement: (...args) => dispatch(onDecrement(...args)),
  onAdd: (...args) => dispatch(onAdd(...args))
}) */

// 可以看出来 mapDispatchToProps 内部的代码  相似度极其的高

// 继续变形
/* 
// 创建 actions.js 文件
export const onDecrement = (payload) => ({ type: 'DECREMENT', payload })

export const onAdd = () => ({ type: 'ADD' })

// connect 包装的组件文件
import * as actions from './action';
import { bindActionCreators } from 'redux';

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatch,
  ...bindActionCreators(actions, dispatch)
})
*/

// 变形后 connect 文件就能在 props 里面直接拿到与 actions.js 定义的相同名字的方法了

// 同步到异步的转变升级
/**
 * 通常，一个 action 会对应的调起一个 reducer
 * 但是在发起请求的时候往往需要在一个动作里面执行多个 reducer
 * 比如在发起请求前的 loading 请求结束后的 loaded 或者 error。虽然可以在组件内多次调用去实现，但是非常的繁琐
 * 这个时候的action，我们更希望以一种函数的形式呈现，像下面这样
 */
/* export const onDecrement = (payload) => (dispatch, getState) => {
  dispatch({ type: "LOADING" });
  fetch(
    // 请求参数
  )
    .then((data) => {
      dispatch({ type: "LOADED" });
      dispatch({ type: "DECREMENT", payload: data });
    })
    .catch((err) => {
      dispatch({ type: "ERROR", payload: err });
    });
}; */

// 此时 dispatch 的对象不再只是一个对象 还可以是一个函数，需要借助中间件，以 redux-thunk 为例
/* 
// store.js
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
// 如果只有⼀个 reducer
const store = createStore(reducer, applyMiddleware(thunk));
// ...

// 当有多个 reducer 时，我们会在不同模块维护，然后集中到这⾥合并为⼀个 reducer:
// 借助 combineReducers。同时下⽂ mapStateToProps 及 useSelector
// 的第⼀个参数，也将相应地变成⼀个 { home, about } 对象
import home from "@/home/reducer";
import about from "@/about/reducer";
const reducer = combineReducers({
  home,
  aboutState: about, // 可以重命名，保持下⽂使⽤的键名与此处⼀致即可
});
const store = createStore(reducer, applyMiddleware(thunk));
//  ...
 */
// 除了 redux-thunk 可以作为辅助中间件，还有 redux-promise

// 高阶到hook
/* 使⽤ connect + mapStateToProps + mapDispatchToProps 来获取状态与⽅法的形式可以说是 react hooks
早先结合 redux 唯⼀的⽅式，但是在 react-redux ⽀持 hooks 之后，这⼀切越来越简单了： */
// App.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";

export default function App() {
  const number = useSelector((state) => state.number);
  // 如果上⽂使⽤了 combineReducers，这⾥应该写成：
  // const number = useSelector(state => state.home.number);
  // 或 const number = useSelector(({ home }) => home.number);
  const dispatch = useDispatch();
  const onDecrement = () => {
    dispatch({
      type: "DECREMENT",
      payload: 2,
    });
  };
  return <button onClick={onDecrement}>{number}</button>;
}

// 这里不需要使用 connect 注入 props，虽然二者能混用，但强烈不建议
