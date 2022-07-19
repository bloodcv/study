// 三个状态流转
PENDING = "pending";
FULFILLED = "fulfilled";
REJECTED = "rejected";
class MyPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  // 状态初始化
  _status = PENDING;
  constructor(fn) {
    this.value = null;
    this.reason = null;
    try {
      // 入参是一个函数，参数是promise内部的resolve和reject
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    // 状态变更后依次执行缓存区里面的回调函数
    switch (this._status) {
      case FULFILLED:
        this.FULFILLED_CALLBACK_LIST.forEach((c) => c(this.value));
        break;
      case REJECTED:
        this.REJECTED_CALLBACK_LIST.forEach((c) => c(this.reason));
        break;
      default:
        break;
    }
  }

  // 只有 pending 才能转 fulfilled
  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  // 只有 pending 才能转rejected
  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  // then 接收两个参数 onFulfilled  onRejected，分别处理 fulfilled  rejected
  then(onFulfilled, onRejected) {
    // then 的两个参数必须是函数  不是函数就要忽略
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => value;
    const realOnRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };

    // 至此 一个promise的基础就完成了  但是不支持链式的调用 因为返回出去的promise没有resolve也没有reject
    /* const promise2 = new MyPromise((resolve, reject) => {
        // 根据当前的 promise 的状态调用不同的处理方法 realOnFulfilled realOnRejected 
        switch (this.status) {
          case FULFILLED:
            realOnFulfilled(this.value);
            break;
          case REJECTED:
            realOnRejected(this.reason);
            break;
          // then 调用后会立即执行里面的函数（比如设置了延迟resolve就不能立马得到状态变更的结果），所以需要设置一个缓存区，当状态未变更的时候存入回调，当状态变更的时候去执行回调
          case PENDING:
            this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled);
            this.REJECTED_CALLBACK_LIST.push(realOnRejected);
          default:
            break;
        }
    }) */

    // 为了支持链式调用，所以需要处理 onFulfilled 和 onRejected 的结果 x
    // 处理的方法就是 resolvePromise 因为通用 所以抽离出来了
    // 又因为then 是个异步的微任务操作  所以采用 queueMicrotask 模拟异步的操作 也可以用 setTimeout
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      switch (this.status) {
        case FULFILLED: {
          fulfilledMicrotask();
          break;
        }
        case REJECTED: {
          rejectedMicrotask();
          break;
        }
        // then 调用后会立即执行里面的函数（比如设置了延迟resolve就不能立马得到状态变更的结果），所以需要设置一个缓存区，当状态未变更的时候存入回调，当状态变更的时候去执行回调
        case PENDING: {
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
          break;
        }
        default:
          break;
      }
    });

    // then 的返回值应该是一个 promise
    return promise2;
  }

  isFunction(param) {
    return typeof param === "function";
  }

  catch(cb) {
    return this.then(null, cb);
  }
  // promise2：新的Promise对象
  // x：上一个then的返回值
  // resolve：promise2的resolve
  // reject：promise2的reject
  resolvePromise(promise2, x, resolve, reject) {
    // 如果 x 和 promise2 一样 则会陷入无限循环
    if (x === promise2) {
      reject(new TypeError("chaining cycle"));
    }

    if (x instanceof MyPromise) {
      // 如果 x 为 Promise ，则使 newPromise 接受 x 的状态
      // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
    }

    // 否则 判断 x 是不是一个对象或者函数  不是的话直接resolve出去
    else if (x !== null && (typeof x === "object" || typeof x === "function")) {
      let used;
      // 如果是对象或者函数 尝试取出 x.then 给 then
      try {
        let then = x.then;
        // 取出后 判断是不是函数
        if (typeof then === "function") {
          // 是函数的话 x作为then的this，再传入两个回调参数
          // then.call(x, (y) => resolve(y), (r) => reject(r))
          // 如果y还是一个promise对象 那就需要继续链式调用直到拿到结果
          then.call(
            x,
            (y) => {
              if (used) return;
              used = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (used) return;
              used = true;
              reject(r);
            }
          );
        } else {
          // 不是函数 直接resolve
          if (used) return;
          used = true;
          resolve(x);
        }
      } catch (error) {
        if (used) return;
        used = true;
        reject(error);
      }
    } else {
      // 普通值
      resolve(x);
    }
  }

  static resolve(param) {
    return new MyPromise((resolve, reject) => {
      resolve(param)
    })
  }

  static reject(param) {
    return new MyPromise((resolve, reject) => {
      reject(param)
    })
  }

  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      promiseList.forEach(c => {
        if (!(c instanceof MyPromise)) {
          c = Promise.resolve(c);
        }
        c.then(res => {
          resolve(res)
        }).catch(res => {
          reject(res);
        })
      })
    })
  }

  static all(promiseList) {
    let n = promiseList.length, resolveBack = new Array(n).fill(null), cnt = 0;
    return new MyPromise((resolve, reject) => {
      promiseList.forEach((c, idx) => {
        if (!(c instanceof MyPromise)) {
          c = Promise.resolve(c);
        }
        c.then(res => {
          resolveBack[idx] = res;
          cnt++;
          if (cnt === n) {
            resolve([...resolveBack])
          }
        }).catch(e => {
          return reject(e);
        })
      })
    })
  }
}

/* const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1");
  }, 2000);
});

p1.then((res) => {
  console.log('1', res);
  return "p11";
}).then((res) => {
  console.log('2', res);
}); */
/* const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("p1");
  }, 2000);
});

p1.then((res) => {
  console.log(res);
  return "p11";
}).catch((res) => {
  console.log('catch', res);
}); */

// const p1 = Promise.resolve('kkk')
// const p1 = Promise.reject('kkk')
// p1.then(res => console.log('then', res)).catch(res => console.log('catch', res));

// const p1 = MyPromise.resolve('kkk')
// const p1 = MyPromise.reject('kkk')
// p1.then(res => console.log('then', res)).catch(res => console.log('catch', res));

/*
const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1')
  }, 5000);
})
const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('p2')
  }, 1000);
})
const p3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p3')
  }, 2000);
})
const p4 = 'k';

const p5 = MyPromise.race([p1, p2, p3, p4]).then(res => {
  console.log('then', res);
}).catch(res => {
  console.log('catch', res);
}) */


const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1')
  }, 5000);
})
const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('p2')
  }, 1000);
}).catch(res => {
  console.log('p2-catch', res)
  return res
})
const p3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p3')
  }, 2000);
})
const p4 = 'k';

const p5 = MyPromise.all([p1, p2, p3, p4])

p5.then(res => {
  console.log('then', res);
}).catch(res => {
  console.log('catch', res);
})
