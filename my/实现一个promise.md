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