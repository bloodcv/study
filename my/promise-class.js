const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Mypromise {
  FULLFILLED_CALLBACK_LIST = []
  REJECTED_CALLBACK_LIST = []
  _status = PENDING
  constructor(fn) {
    // 初始状态为pending
    // this.status = PENDING;
    this.value = null;
    this.reason = null;
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    switch (newStatus) {
      case FULFILLED: {
        this.FULLFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value);
        });
        break;
      }
      case REJECTED: {
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason);
        });
        break;
      }
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => value;
    const realOnRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };
    const promise2 = new Mypromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
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
        case PENDING: {
          this.FULLFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
          // break;
        }
      }
    });
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      value => {
        return Mypromise.resolve(callback()).then(() => value)
      },
      reason => {
        return Mypromise.resolve(callback()).then(() => { throw reason })
      }
    )
  }

  isFunction(params) {
    return typeof params === "function";
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(
        new TypeError("The promise and the return value are the same")
      );
    }

    if (x instanceof Mypromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
    } else if (typeof x === "object" || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }

      let then = null;

      try {
        then = x.then;
      } catch (error) {
        return reject(error);
      }

      if (this.isFunction(then)) {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } catch (error) {
          if (called) return;
          reject(error);
        }
      } else {
        resolve(x)
      }
    } else {
      resolve(x);
    }
  }

  // 静态resolve方法
  static resolve(value) {
    if (value instanceof Mypromise) {
      return value;
    }

    return new Mypromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new Mypromise((resolve, reject) => {
      reject(reason);
    });
  }

  static race(promiseList = []) {
    return new Mypromise((resolve, reject) => {
      let length = promiseList.length;
      if (length < 1) {
        resolve();
      } else {
        for (let i = 0; i < promiseList.length; i++) {
          Mypromise.resolve(promiseList[i]).then(
            (value) => {
              resolve(value);
            },
            (reason) => {
              reject(reason);
            }
          );
        }
      }
    });
  }

  static all(promiseList = []) {
    return new Mypromise((resolve, reject) => {
      let result = [];
      let count = 0;
      if (promiseList.length < 1) {
        resolve();
      }
      for (let i = 0; i < promiseList.length; i++) {
        Mypromise.resolve(promiseList[i])
          .then((value) => {
            result[i] = value;
            count++;
            if (count === promiseList.length) {
              resolve(result);
            }
          })
          .catch((reason) => {
            reject(reason);
          });
      }
    });
  }
}

/* const test = new Mypromise((resolve, reject) => {
  setTimeout(() => {
      resolve(111);
  }, 1000);
}).then(console.log);

console.log('===test===:', test);

setTimeout(() => {
  console.log('===test=setTimeout==:', test);
}, 2000)


const test1 = new Mypromise((resolve, reject) => {
  setTimeout(() => {
      reject(111);
  }, 1000);
}).then((value) => {
  console.log('then');
}).catch((reason) => {
  console.log('catch');
}) */

let p1 = new Mypromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1')
  }, 2000);
})
let p2 = new Mypromise((resolve, reject) => {
  setTimeout(() => {
    reject('p2')
  }, 3000);
})
let p3 = new Mypromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p3')
  }, 1000);
})

/* Mypromise.race([p1, p2]).then(res => {
  console.log(`race-then:${res}`)
}).catch(res => {
  console.log(`race-catch:${res}`)
}) */

/* Mypromise.all([p1, p2]).then(res => {
  console.log(`all-then:${res}`)
}).catch(res => {
  console.log(`all-catch:${res}`)
}) */
p2.then(res => {
  console.log('p2-then:', res)
}).catch(res => {
  console.log('p2-catch:', res)
}).finally(res => {
  console.log('p2', res)
})
p3.then(res => {
  console.log('p3-then:', res)
}).catch(res => {
  console.log('p3-catch:', res)
}).finally(res => {
  console.log('p3', res)
})
