# 一步步实现一个Promise

- 1. 平时使用 promise 是通过 `new Promise` 创建，所以可以用构造函数或者class实现，这里用class实现

```js
class Mypromise {
  constructor() {
  }
}
```

- 2. promise 流转有三种状态 所以 定义三个常态


```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```

- 3. 初始化 promise

```js
class Mypromise {
  constructor() {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
  }
}
```

- 4. resolve 和 reject 方法

  - 4.1 根据规范，需要用 resolve/reject 修改 promise 状态，从 pending --> fulfilled/rejected
  - 4.2 `注意⚠️`：这两个函数的入参分别是 value / reason

```js
class Mypromise {
  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    this.reason = reason;
    this.status = REJECTED;
  }
}
```

- 5. promise 的入参是函数，该函数需要立即执行

    - 5.1 入参是一个函数，函数接收 resolve、reject 两个参数
    - 5.2 初始化 promise 的时候就要执行这个函数，并且有任何错误都要通过 reject 抛出去

```js
  try {
    fn(this.resolve.bind(this), this.reject.bind(this));
  } catch (e) {
    this.reject(e);
  }
```

- 6. then 实现

  1. then 接收两个参数，onFulfilled 和 onRejected

  ```js
    then(onFulfilled, onRejected) {}
  ```
  
  2. 检查并处理参数，如果不是function就忽略，忽略指的是原样返回value或reason

  ```js
    isFunction(param) {
      return typeof param === 'function'
    }
  
    then(onFulfilled, onRejected) {
      const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value;
      const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => reason;
    }
  ```

  3. .then 的返回值整体是一个promise，所以需要用promise包裹一下

  ```js

    then(onFulfilled, onRejected) {
      const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value;
      const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => reason;

      const promise2 = new MyPromise((resolve, reject) => {})
      return promise2
    }

  ```

  4. 根据当前promise的状态，调用不同的函数

  ```js
  
    then(onFulfilled, onRejected) {
      const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value;
      const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => reason;

      const promise2 = new MyPromise((resolve, reject) => {
        switch(this.status) {
          case FULFILLED: {
            realOnFulfilled(this.value)
            break;            
          }
          case REJECTED: {
            realOnRejected(this.reason)
            break;            
          }
        }
      })
      return promise2
    }
  
  ```

  5. 目前这样写，then在调用的时候会被立即执行，此时可能promise的状态status还没变成fulfilled或者rejected，很有可能还是pending的状态。所以我们需要一个状态的监听机制，当状态变成fulfilled或者rejected后再去执行callback

    1. 那么我们首先要拿到所有的callback，然后才能在某个时机去执行他，新建两个数组储存成功和失败的回调，在调用then的时候如果还是pending就存入数组。

    ```js
    
      FULFILLED_CALLBACK_LIST = [];
      REJECTED_CALLBACK_LIST = [];
        
      switch (this.status) {
        case FULFILLED: {
          realOnFulfilled(this.value);
          break;
        }
        case REJECTED: {
          realOnRejected(this.reason);
          break;
        }
        case PENDING: {
          this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled);
          this.REJECTED_CALLBACK_LIST.push(realOnRejected);
          break;
        }
      }

    ```

    2. 在status发生变化的时候，就执行所有的回调，这里使用es6的getter和setter，更加语义化，在status变化的时候去做对应的事情（也可以顺序执行的方式，在给status赋新值后，在后面加forEach执行callback）

    ```js

    _status = PENDING;

    get status() {
      return this._status;
    }

    set status(newStatus) {
      this._status = newStatus;
      switch (newStatus) {
        case FULFILLED:
          this.FULLFILLED_CALLBACK_LIST.forEach(callback => {
            callback(this.value);
          });
          break;
        case REJECTED:
          this.REJECTED_CALLBACK_LIST.forEach(callback => {
            callback(this.reason);
          })
          break;
      }
    }

    ```

- 7. then 的返回值
    上面只是简单的说了下then的返回值是promise，下面具体说一下返回promise的value和reason分别是什么

    1. 如果onFulfilled 或者 onRejected 抛出一个异常 e，那么promise2必须拒绝执行，并返回拒因 e（这样的话就必须手动catch代码，遇到报错就直接reject）

    ```js
    
    then(onFulfilled, onRejected) {
      const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value;
      const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => reason;

      const promise2 = new MyPromise((resolve, reject) => {
        const fulfilledMicrotask = () => {
          try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }

        const rejectedMicrotask = () => {
          try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }

        switch(this.status) {
          case FULFILLED: {
            fulfilledMicrotask(this.value)
            break;            
          }
          case REJECTED: {
            rejectedMicrotask(this.reason)
            break;            
          }
          case PENDING: {
            this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
            this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
            break;
          }
        }
      })
      return promise2
    }
    
    ```

    2. 如果 onFulfilled 不是函数，且promise1成功执行，那么promise2必须成功执行并返回相同的值

    3. 如果 onRejected 不是函数，且promise1 成功执行，那么 promise2 必须拒绝执行并返回相同的原因

    这里其实已经在参数检查的时候做过了

    ```js
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
        return value
    }
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
        throw reason;
    };
    ```

    ⚠️注意：如果 promise1 的 onRejected 执行成功了，promise2 应该被 resolve

    4. 如果 onFulfuilled 或者 onRejected 返回一个值 x，则运行 resolvePromise 方法

    ```js
    
      const fulfilledMicrotask = () => {
          try {
              const x = realOnFulfilled(this.value);
              this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
              reject(e)
          }
      };
      const rejectedMicrotask = () => {
          try {
              const x = realOnRejected(this.reason);
              this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
              reject(e);
          }
      }
    
    ```

- 8. resolvePromise

  ```js
    resolvePromise(promise2, x, resolve, reject) {
        // 为了防止死循环
        // 如果newPromise 和 x 指向同一个对象，以 TypeError 为拒因拒绝执行 newPromise
        if (promise2 === x) {...}

        if (x instanceof MPromise) {
            // 如果 x 为 Promise，则使 newPromise 接受 x 的状态
            // 也就是继续执行 x，如果执行的时候拿到y 还需要继续解析y
        } else if (typeof x === 'object' || this.isFunction(x)) {
            // 如果 x 是函数或者对象
            if (x === null) {
              // null 也会被判断为对象
            }

            let then = null;

            try {
                // 把 x.then 赋值给 then
                then = x.then;
            } catch (error) {
                // 如果 x.then 的值的时候抛出错误 e，则以 e 为拒因拒绝 promise
                return reject(error);
            }

            // 如果 then 是函数
            if (this.isFunction(then)) {
                let called = false;
                // 将 x 作为函数的作用域 this 调用
                // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
            } else {
                // 如果 then 不是函数，以 x 为参数执行 promise
                resolve(x);
            }
        } else {
            // 如果 x 不为对象或者函数，以 x 为参数执行 promise
            resolve(x);
        }
    }
  ```
  补充完善一下
  ```js
    resolvePromise(promise2, x, resolve, reject) {
        // 如果 newPromise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 newPromise
        // 这是为了防止死循环
        if (promise2 === x) {
            return reject(new TypeError('The promise and the return value are the same'));
        }

        if (x instanceof MPromise) {
            // 如果 x 为 Promise ，则使 newPromise 接受 x 的状态
            // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
            queueMicrotask(() => {
                x.then((y) => {
                    this.resolvePromise(promise2, y, resolve, reject);
                }, reject);
            })
        } else if (typeof x === 'object' || this.isFunction(x)) {
            // 如果 x 为对象或者函数
            if (x === null) {
                // null也会被判断为对象
                return resolve(x);
            }

            let then = null;

            try {
                // 把 x.then 赋值给 then 
                then = x.then;
            } catch (error) {
                // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
                return reject(error);
            }

            // 如果 then 是函数
            if (this.isFunction(then)) {
                let called = false;
                // 将 x 作为函数的作用域 this 调用
                // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
                try {
                    then.call(
                        x,
                        // 如果 resolvePromise 以值 y 为参数被调用，则运行 resolvePromise
                        (y) => {
                            // 需要有一个变量called来保证只调用一次.
                            if (called) return;
                            called = true;
                            this.resolvePromise(promise2, y, resolve, reject);
                        },
                        // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                        (r) => {
                            if (called) return;
                            called = true;
                            reject(r);
                        });
                } catch (error) {
                    // 如果调用 then 方法抛出了异常 e：
                    if (called) return;

                    // 否则以 e 为据因拒绝 promise
                    reject(error);
                }
            } else {
                // 如果 then 不是函数，以 x 为参数执行 promise
                resolve(x);
            }
        } else {
            // 如果 x 不为对象或者函数，以 x 为参数执行 promise
            resolve(x);
        }
    }
  ```

- 9. onFulfilled 和 onRejected 是微任务  可以用queueMicrotask包裹执行函数

  ```js
    const fulfilledMicrotask = () => {
        queueMicrotask(() => {
            try {
                const x = realOnFulfilled(this.value);
                this.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
                reject(e)
            }
        })
    };
    const rejectedMicrotask = () => {
        queueMicrotask(() => {
            try {
                const x = realOnRejected(this.reason);
                this.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
                reject(e);
            }
        })
    }
  ```


10. 简单写点代码测试一下

```js
const test = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(111);
    }, 1000);
}).then(console.log);

console.log(test);

setTimeout(() => {
    console.log(test);

}, 2000)
```

    这个时候同学们会发现, 为什么我可以调用.then, 不可以调用.catch呢? 因为我们并没有在类里面声明catch方法

11. catch方法

```js
catch (onRejected) {
    return this.then(null, onRejected);
}
```

12. promise.resolve

    将现有对象转为Promise对象，如果 Promise.resolve 方法的参数，不是具有 then 方法的对象（又称 thenable 对象），则返回一个新的 Promise 对象，且它的状态为fulfilled。
    注意这是一个静态方法, 因为咱们是通过Promise.resolve调用的, 而不是通过实例去调用的.

```js
static resolve(value) {
    if (value instanceof MPromise) {
        return value;
    }

    return new MPromise((resolve) => {
        resolve(value);
    });
}
```

13. promise.reject

    返回一个新的Promise实例，该实例的状态为rejected。Promise.reject方法的参数reason，会被传递给实例的回调函数。

```js
static reject(reason) {
    return new MPromise((resolve, reject) => {
        reject(reason);
    });
}
```

14. promise.race

    `const p = Promise.race([p1, p2, p3]);`

    该方法是将多个 Promise 实例，包装成一个新的 Promise 实例。
    只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

```js
static race(promiseList) {
    return new MPromise((resolve, reject) => {
        const length = promiseList.length;

        if (length === 0) {
            return resolve();
        } else {
            for (let i = 0; i < length; i++) {
                MPromise.resolve(promiseList[i]).then(
                    (value) => {
                        return resolve(value);
                    },
                    (reason) => {
                        return reject(reason);
                    });
            }
        }
    });

}
```

    写段测试代码

```js
const test = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(111);
    }, 1000);
});

const test2 = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(222);
    }, 2000);
});

const test3 = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(333);
    }, 3000);
});

MPromise.race([test, test2, test3]).then(console.log);
```