const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Mypromise {

  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;
  constructor(fn) {
    this.status = _status;
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
      : (reason) => reason;
    const promise2 = new Mypromise((resolve, reject) => {
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
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
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

  resolvePromise() {

  }
}
