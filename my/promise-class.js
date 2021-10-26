const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Mypromise {

  FULLFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;
  constructor(fn) {
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

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    this.reason = reason;
    this.status = REJECTED;
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => value;
    const realOnRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {throw reason};
    const promise2 = new Mypromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }          
        })
      }

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }          
        })
      }
      
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
          break;
        }
      }
    });
    return promise2;
  }

  isFunction(params) {
    return typeof params === "function";
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('The promise and the return value are the same'))
    }

    if (x instanceof Mypromise) {
      queueMicrotask(() => {
        x.then(y => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject)
      })
    } else if (typeof x === 'object' || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }

      let then = null;
      
      try {
        then = x.then;
      } catch (e) {
        return reject(e);
      }

      if (this.isFunction(then)) {
        let called = false;
        try {
          then.call(x,
            y => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r)
            });
        } catch (e) {
          if (called) return;
          reject(e)
        }
      }

    } else {
      reject(x);
    }
  }
}


const test = new Mypromise((resolve, reject) => {
  setTimeout(() => {
      resolve(111);
  }, 1000);
}).then(console.log);

console.log('===test===:', test);

setTimeout(() => {
  console.log('===test=setTimeout==:', test);
}, 2000)
