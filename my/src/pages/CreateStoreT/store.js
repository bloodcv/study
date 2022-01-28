// 创建 store
// store 是状态的容器，包含了状态的改变，更新状态，监听状态改变的方法
// createStore 核心源码梳理后的代码见 @/store/createStore-theory.js
import { createStore } from 'redux'

const initialState = {
  count: 0
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 }
    default:
      return state;
  }
}

const store = createStore(reducer);

// console.log('store:', store)
export default store;