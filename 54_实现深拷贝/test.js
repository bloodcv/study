
var dcp = (target, hash = new WeakMap()) => {
  let cloneobj
  const type = Object.prototype.toString.call(target)
  if (type === '[object Array]') {
    cloneobj = target.constructor()
    hash.set(target, cloneobj)
    target.forEach((v, i) => {
      cloneobj[i] = dcp(v, hash)
    })
  } else if (type === '[object Object]') {
    cloneobj = target.constructor()
    hash.set(target, cloneobj)
    for(let k in target) {
      if (Object.hasOwnProperty.call(target, k)) {
        if (hash.has(target[k])) {
          cloneobj[k] = hash.get(target[k])
        } else {
          cloneobj[k] = dcp(target[k], hash)
        }
      }
    }
  } else if (type === '[object Function]') {
    let fstr = target.toString()
    let fstrBody = fstr.substring(fstr.indexOf('{') + 1, fstr.lastIndexOf('}'))
    return new Function(fstrBody)
  } else if (type === '[object Symbol]'){
    return Symbol(target.description)
  } else if (type === '[object Map]') {
    cloneobj = new Map()
    for (const [k, v] of target) {
      if (hash.has(v)) {
        cloneobj.set(k, hash.get(v))
      } else {
        cloneobj.set(k, dcp(v, hash))
      }
    }
  } else if (type === '[object Set]') {
    cloneobj = new Set()
    for (const v of target) {
      if (hash.has(v)) {
        cloneobj.add(hash.get(v))
      } else {
        cloneobj.add(dcp(v, hash))
      }
    }
  } else {
    return target
  }
  return cloneobj
}

var a = {
  b: null,
  c: 1,
  d: {d: 1},
  e: [1, 2, {e: 1}],
  f: new Map([['fa', 1]]),
  g: new Set([1])
}
a.b = a
a.f.set('fb', a)
a.g.add(a)
var b = dcp(a)
console.log(b)

// 这种方式只能对同一作用域的函数进行拷贝
/* function fn() {
  if (true) {
    return "你是大聪明"
  } else {
    return "我是大聪明"
  }
}

let str = fn.toString()
let newStr = str.substring(str.indexOf("{") + 1, str.lastIndexOf("}"))
let newFn = new Function(newStr)
console.log(newFn === fn); // false
console.log(newFn()); // 你是大聪明
console.log(fn()); // 你是大聪明 */