/**
 * 14. Proxy 可以实现什么功能?
 */
/* let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`获取属性${property}的值为${target[property]}`)
  }
)
console.log(p.a)
console.log(p.b)
p.a = 2
p.b = 1
console.log(p.a)
console.log(p.b)
console.log(obj) */

/**
 * 15. 常用的正则表达式有哪些?
 */
// 匹配16进制颜色
var regex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g
// 匹配日期 如yyyy-mm-dd 格式
var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/g
// 匹配qq号
var regex = /^[1-9][0-9]{4, 10}$/g
// 手机号码正则
var regex = /^1[34578]\d{9}$/g
// 用户名正则
var regex = /^[a-zA-Z\$][a-zA-Z0-9_\$]{4,16}$/g

/**
 * 20. 实现一个 AJAX 请求
 */

// 原生
/* const SERVER_URL = '/server_url'
let xhr = new XMLHttpRequest(); // 创建一个XML对象
xhr.open('GET', url, true) // XML对象调用open 创建一个http请求  open 方法所需 要的参数是请求的方法、请求的地址、是否异步和用户的认证信息。
// 在发起请求前，可以为这个对象添加一些（头）信息和状态监听函数 当它的状态变化时会触发 onreadystatechange 事件
// 设置响应头
xhr.responseType = 'json'
// 设置请求头
xhr.setRequestHeader('Accept', 'application/json')
// 设置状态监听
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  // 请求成功
  if (this.status === 200) {
    handle(this.response)
  } else {
    console.error(this.statusText)
  }
}
// 设置请求失败处理
xhr.onerror = function() {
  console.error(this.statusText)
}
// 当对象的属性和监听函数设置完成后，最后调用 sent 方法来向服务 器发起请求，可以传入参数作为发送的数据体。
xhr.send(null) */

// 使用 Promise 封装 Ajax

function getJSON(url) {
  let promise = new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = () => {
      if (this.readyState !== 4) return;
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    xhr.onerror = function() {
      reject(new Error(this.statusText))
    }
    xhr.responseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.send(null)
  })
  return promise
}

/**
 * 21. 什么是尾调用，使用尾调用有什么好处?
 */
// https://blog.csdn.net/weixin_44226181/article/details/127877490

/**
 * 23. for...in 和 for...of 的区别
 * https://www.cnblogs.com/rogerwu/p/10738776.html
 */
/* for (const {l, v} of [{l: 'a', v: 1}, {l: 'b', v: 2}]) {
  console.log(l, v)
} */
/* for (const v in {
  a: 1, 
  b: 2
}) {
  console.log(v)
} */

/**
 * 33.对 async/await 的理解
 * https://blog.csdn.net/qq_41131745/article/details/127755975
 */

// problem1
/* async function testSometing() {
  console.log("1执行testSometing");
  return "2testSometing";
}

async function testAsync() {
  console.log("3执行testAsync");
  return Promise.resolve("4hello async");
}

async function test() {
  console.log("5test start...");
  const v1 = await testSometing();
  console.log(v1);
  const v2 = await testAsync();
  console.log(v2);
  console.log(v1, v2);
}

test(); */

// problem2
/* async function a() {
  console.log("1");
  await b();
  console.log("2");
}
async function b() {
  console.log("3");
  await new Promise((resove, reject) => {
    console.log("4");
    resove();
  }).then(() => {
    console.log("5");
  });
  setTimeout(() => {
    console.log("6");
    new Promise((resove, reject) => {
      resove();
    }).then(() => {
      console.log("15");
    });
  });
  console.log("7");
}
new Promise((resove, reject) => {
  console.log("8");
  resove();
  console.log("9");
  reject();
})
  .then(() => {
    console.log("10");
    setTimeout(() => {
      console.log("11");
      new Promise((resove, reject) => {
        resove();
      }).then(() => {
        console.log("12");
      });
    });
  })
  .catch(() => {
    console.log("13");
  });
console.log("14");
a(); */

// problem3
/* console.log('start')

new Promise(function(resolve) {
  console.log('promise1')
  setTimeout(() => {
    console.log('timer1')
  },0)
  resolve()
}).then(() => {
  console.log('promise2')
  setTimeout(() => {
    console.log('timer2')
  },0)
})

const promise1 = Promise.resolve().then(() => {
    console.log('promise3')
    setTimeout(() => {
        console.log('timer3')
    },0)
})

async function async1() {
  console.log('async1')
  await async2()
  console.log('async1 end');
}

async function async2 () {
  console.log('async2')
}

async1()

setTimeout(() => {
  console.log('timer4')
},0)

console.log('script end') */