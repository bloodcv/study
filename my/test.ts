/**
 * keyof
 */
let a = () => {
  interface Person {
    name: string;
    age: number;
  }

  type K1 = keyof Person; // "name" | "age"

  let keyofA:K1 = "age" || "name";
}

/**
 * extends
 */
let b = () => {
  interface ILengthWise {
    length: number;
  }

  function loggingIdentity<T extends ILengthWise>(arg: T):T {
    let a = JSON.parse(JSON.stringify(arg))
    return a;
  }

  loggingIdentity({
    length: 1,
    value: 2
  });
}

/**
 * Partial 将某个类型里面的属性全变成可选项
 */
let c = () => {
  interface testAttr1 {
    name: string,
    age: number,
    address: string,
    sex: string
  }

  let PartialA:testAttr1 = {
    name: '',
    age: 1,
    address: '',
    sex: ''
  }

  let PartialB:Partial<testAttr1> = {
    name: ''
  }  
}

/**
 * Required 将某个类型里的属性全部变成必选项
 */

let d = () => {
  interface testAttr2 {
    name?: string,
    age?: number,
    address?: string,
    sex?: string
  }

  let RequiredA:testAttr2 = {}

  let RequiredB:Required<testAttr2> = {
    name: '',
    age: 1,
    address: '',
    sex: ''
  }  
}

/**
 * Readonly 将某个类型里的属性全变成只读属性 也就是不允许更改
 */

let e = () => {
  interface testIF {
    name?: string,
    age: number,
    ads: string,
    sex: any
  }

  let a:Readonly<testIF> = {
    name: '',
    age: 1,
    ads: '',
    sex: ''
  }
  // a.name = '1';
  // a.age = 2;
  // a.sex = 3;
}

/**
 * Record
 * Record<K extends keyof any, T> 作用是将K中的所有属性值转成 T 类型
 */

let f = () => {
  interface testIF {
    title: any,
  }

  type testTP = 'name' | 'age' | 'ads' | 'sex'

  let a:Record<testTP, testIF> = {
    name: { title: '' },
    age: { title: '' },
    ads: { title: '' },
    sex: { title: '' },
  }
}

/**
 * Exclude
 * Exclude<T, U> 作用是将某一个类型中属于另一个的类型移除掉
 */

let g = () => {
  interface testA {
    name: string,
    ads: string,
    age: number,
    sex: string
  }

  interface testB {
    sex: string
  }

  interface testC {
    age: string
  }

  type testD = Exclude<keyof testA, keyof testB>

  let a: testD = 'name'

  type testE = Exclude<keyof testA, keyof testC>

  let b: testE = 'name'
}


