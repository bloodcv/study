// 真实项目中并不会像 @/pages/CreateStoreT  在业务组件中直接引入 store，
// 而是通过 react-redux，将组件需要的状态注入到 props 中，像这样:

/* import { connect } from 'react-redux';

const mapStateToProps = state => ({
  count: state.count
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  add: () => dispatch({ type: 'ADD' })
})

export default connect(mapStateToProps, mapDispatchToProps)(APP); */

// connect 通过 react 的 context 与 store 关联起来（context 使用见 react_high 分支）

// 基于以上思路及 context 用法，下面模拟实现 connect 的实现

// 文档里的 
/* import React, { Component } from "react";
import PropTypes from "prop-types";

export function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    class Connect extends Component {
      static contextTypes = {
        // 这⾥使⽤函数式组件的话，也可以通过 useContext 来获取 context
        store: PropTypes.object,
      };
      componentDidMount() {
        //从 context 获取 store 并订阅更新
        this.context.subscribe(this.forceUpdate.bind(this));
      }
      render() {
        return (
          <WrappedComponent
            // 传⼊该组件的 props,需要由 connect 这个⾼阶组件原样传回原组件
            {...this.props}
            // 根据 mapStateToProps 把 state 挂到 this.props 上
            {...mapStateToProps(this.context.store.getState())}
            // 根据 mapDispatchToProps 把 dispatch(action) 挂到 this.props 上
            {...mapDispatchToProps(this.context.store.dispatch)}
          />
        );
      }
    }

    return Connect;
  };
} */

// my 自己写的
/* import React, { Component } from "react";
import PropTypes from 'prop-types';

export function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {
    class Connect extends Component {
      static contextType = {
        store: PropTypes.Object
      }

      componentDidMount() {
        this.context.store.subscribe(this.forceUpdate.bind(this))
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToProps(this.context.store.getState())}
            {...mapDispatchToProps(this.context.store.dispatch)}
          />
        )
      }
    }

    return Connect;
  }
} */

/**
 * connect 通过 contextType(class 组件) 或者 useContext(function 最近) 的方式获取store，
 * store肯定是定义在外层, 一般可以在项目的入口处看到有下面的这种定义
 */

/* import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import ReactDOM from 'react-dom';
import App from '../App';

// 忽略其他逻辑
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
) */

/**
 * 通过 connect 导出的组件，乃至整个项目的组件，都是 Provider 的子组件，因此能够获取到 store
 * 那么整条链路都打通了
 */

/**
 * 初始化：
 * 1. createStore 创建全局的 store 对象
 * 2. Provider 把 store 注入到全局（项目根节点）
 * 3. connect
 *  3.1 通过 context API，拿到 store 并映射为被包装组件的 props
 *  3.2 把 connect 组件的更新方法注册到 store 的 listeners
 * 
 * 更新：
 * 1. 被包装的组件调用 props 中的 action，会触发 dispatch => reducer
 * 2. reducer 会生成新的 state，同时遍历存储的 listeners
 * 3. connect 根据状态变化会触发组件的强制更新，包括子组件都会受到影响
 * 
 */

// 入口的 Provider 引入了 react-redux，不难想到 Provider 是基于 createContext 实现，结合 connect 看会更好理解

// react-redux 同时导出 Provider 与 connect
import { createContext, useContext, useState } from 'react';
const ReduxContext = createContext();

const Provider = ReduxContext.Provider;

const connect = (mapStateToProps, mapDispatchToProps) => WrappedComponent => prop => {
  const [, forceUpdate] = useState([]);
  const { store } = useContext(ReduxContext); // 这⾥的参数⼀定与 Provider 是同⼀个对象
  store.subscribe(() => forceUpdate([])); // ⽤于强制更新组件
  const props = {
    ...mapStateToProps(store.getState()),
    ...mapDispatchToProps(store.dispatch),
    ...prop
  };

  return <WrappedComponent {...props} />;
}
export { Provider, connect };

// 拆解后
/* import { createContext, useContext, useState } from 'react';
const ReduxContext = createContext();

const Provider = ReduxContext.Provider;

const connect = (mapStateToProps, mapDispatchToProps) => {
  return (WrappedComponent) => {
    return (prop) => {
      const [, forceUpdate] = useState([]);
      const { store } = useContext(ReduxContext); // 这⾥的参数⼀定与 Provider 是同⼀个对象
      store.subscribe(() => forceUpdate([])); // ⽤于强制更新组件
      const props = {
        ...mapStateToProps(store.getState()),
        ...mapDispatchToProps(store.dispatch),
        ...prop
      }
      return <WrappedComponent {...props} />;
    }
  }
}

export { Provider, connect }; */