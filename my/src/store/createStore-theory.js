/* createStore 核心原理等价于下面的逻辑
真实的 redux 源码涉及到 currentListeners, nextListeners replaceReducer, 
[$$observable]: observable 等内容，感兴趣的可以自行了解。 */

/* function createStore(reducer) {
  let state;
  let listeners = []; // 订阅事件的数组
  const getState = () => {
    return state;
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }
    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  dispatch({ type: "@@redux-init@@" });
  // 执⾏⼀次业务中不存在的 type，⽬的是初始化 state
  return {
    // 关注我们前⾯⽤到的 3 个接⼝
    getState,
    dispatch,
    subscribe,
  };
} */

/* function my_createStore(reducer) {
  let state;
  // 订阅事件的数组
  let listeners = [];

  const getState = () => {
    return state
  }

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.map(listener => listener())
  }

  const subscribe = (listener) => {
    if (!listeners.includes(listener)) {
      listeners.push(listener)
    }
    return function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    }
  }

  dispatch({ type: '@@redux-init@@' })

  return {
    getState,
    dispatch,
    subscribe
  }
} */
