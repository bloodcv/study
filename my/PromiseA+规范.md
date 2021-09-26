# PromiseA+规范

## 术语

1. promise 是一个有 then 方法的对象或者函数，行为遵循本规范
2. thenable是一个有 then 方法的对象或者函数
3. value 是 promise 状态成功时的值，也就是 resolve 的参数，包括各种数据类型，也包括 undefined/thenable 或者是promise
4. reason 是 promise 状态失败时的值，也就是 reject 的参数，表示拒绝的原因
5. exception 是一个使用 throw 抛出的异常值

## 规范

### Promise States

- promise 应该有三种状态 ⚠️注意他们之间的流转关系

1. pending  

    1.1 初始的状态，可改变  
    1.2 一个 promise 在 resolve 或者 reject 前应该都属于这个状态  
    1.3 可以通过 resolve --> fulfilled 状态  
    1.4 可以通过 reject --> rejected 状态  

2. fulfilled

    2.1 最终状态，不可改变  
    2.2 一个 promise 通过 resolve 后会变成这个状态  
    2.3 必须拥有一个 value 值  

3. rejected
  
    3.1 最终状态，不可改变  
    3.2 一个 promise 通过 reject 后会变成这个状态  
    3.3 必须拥有一个 reason 值  

4. 总结：promise 的状态流转

    4.1 pending --> resolve(value) --> fulfilled  
    4.2 pending --> reject(reason) --> rejected  

### then

- promise 应该提供一个 then 方法， 用来访问最终的结果，无论是 value 还是 reason

```js
promise.then(onFulfilled, onRejected)
```

1. 参数要求

    1.1 onFulfilled `必须`是函数类型，如果不是函数，应该被忽略  
    1.2 onRejected `必须`是函数类型，如果不是函数，应该被忽略  

2. onFulfilled 特性

    2.1 在 promise 变成 fulfilled 时，应该调用 onFulfilled，参数是 value  
    2.2 在 promise 变成 fulfilled 之前，不应该被调用  
    2.3 `只能`被调用`一次`(所以在实现的时候需要使用一个变量来限制执行次数)  

3. onRejected 特性

    3.1 在 promise 变成 rejected 时，应该调用 onRejected，参数是 reason
    3.2 在 promise 变成 rejected 之前，不应该被调用
    3.3 `只能`被调用`一次`(所以在实现的时候需要使用一个变量来限制执行次数)

4. onFulfilled 和 onRejected 应该是微任务

    这里用queueMicrotask来实现微任务的调用

5. then 方法可以被调用多次

    5.1 promise 状态变成 fulfilled 后，所有的 onFulfilled 回调都需要按照 then 的顺序执行，也就是按照 then 的注册顺序执行(所以在实现的时候，需要一个数组存放多个 onFulfilled 的回调)
    5.2 promise 状态变成 rejected 后，所有的 onRejected 回调都需要按照 then 的顺序执行，也就是按照 then 的注册顺序执行(所以在实现的时候，需要一个数组存放多个 onRejected 的回调)

6. 返回值

    then 应该返回一个 promise

    ```js
      promise2 = promise1.then(onFulfilled, onRejected);
    ```

    6.1 onFulfilled 或 onRejected 的执行结果为 x，调用resolvePromise
    6.2 如果  onFulfilled 或 onRejected 执行时抛出异常 e，promise2 需要被 reject
    6.3 如果 onFulfilled 不是一个函数，promise2 以 promise1 的 value 触发 fulfilled
    6.4 如果 onRejected 不是一个函数，promise2 以 promise1 的 reason 触发 rejected

7. resolvePromise（这段建议结合代码去看）

  ```js
    resolvePromise(promise2, x, resolve, reject);
  ```

  7.1 如果 promise2 === x 那么 reject TypeError
  7.2 如果 x 是一个 promise

  7.3 如果 x 是一个 Object 或者是一个 Function
