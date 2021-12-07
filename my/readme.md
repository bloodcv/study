## 常见问题

1. 使用ts的好处是什么
-   1.1 TypeScript 是 JavaScript 的加强版 
    它给 JavaScript 增加了可选的静态类型 和 基于类的面向对象编程
    它拓展了 JavaScript 的语法，所以 ts 的功能比 js 只多不少
-   1.2 TypeScript 是纯面向对象的编程语言，包含类和接口的概念
-   1.3 TypeScript 在开发时就能给出编译错误，Js的错误需要在运行时才能暴露
-   1.4 作为强类型语言，可以明确地知道数据的类型，代码可读性极强，几乎每个人都能读懂
-   1.5 ts中有很多方便的特性，比如可选链

2. type 和 interface 的异同
-   2.1 一般使用 type 描述类型；用 interface 描述数据结构
-   2.2 都可以描述一个对象或者函数

```ts
interface User {
  name: string,
  age: number
}

type User = {
  name: string,
  age: number
}

interface SetUser {
  (name: string, age: number): void
}

type SetUser = (name: string, age: number) => void

```

-   2.3 都允许拓展 extends
    interface 和 type 都可以拓展（extends），但两者不是独立的，interface 可以 extends type，type 也可以 extends interface，虽然效果差不多，但是他们的语法不同

```ts
// interface extends interface
interface Name {
  name: string
}

interface User extends Name {
  age: number
}

// interface extends type
type Name = {
  name: string
}

interface User extends Name {
  age: number
}

// type extends type
type Name = {
  name: string
}

type User = Name & {
  age: number
}

// type extends interface
interface Name {
  name: string
}

type User = Name & {
  age: number
}

```

-   2.4 只有 type 可以做的
    type 可以声明 基本类型、联合类型、元组等

```ts
// 基本类型别名
type Name = string

// 联合类型
interface Dog {
  wang()
}

interface Cat {
  miao()
}

type Pet = Dog | Cat

// 可以定义数组每个位置的具体类型
type Pet = [Dog, Cat]

// 获取某个变量的类型,用 typeof
let div = document.createElement('div')
type A = typeof div

```

3. 如何基于一个已有类型，拓展出一个大部分内容相似，但是有部分区别的类型

```ts
// Pick 选择属性
interface User {
  name: string
  sex: string
  age: number
}

// type A = { sex: string }
type A = Pick<User, 'sex'>

let a: A = { sex: 'female' }

// Omit 剔除属性
// type B = { name: string; age: number }
type B = Omit<User, 'sex'>

let b: B = {
  name: 'name',
  age: 1
}

// Partial、Require、泛型等

```

4. 什么是泛型、泛型的具体应用
-   泛型指的是在定义函数、接口或者类的时候，不预先指定具体的类型，而是在使用的时候根据具体的入参再去指定类型的一种特性
-   可以把泛型理解为代表类型的参数

```ts

interface Test<T = any> {
  name: T
}

type TSA = Test<string>;
type TSB = Test<number>;

let a: TSA = { name: '' }
let b: TSB = { name: 1 }

```







4. 什么是泛型, 泛型的具体使用?

泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，使用时再去指定类型的一种特性。

可以把泛型理解为代表类型的参数

```ts
interface Test<T = any> {
    userId: T;
}

type TestA = Test<string>;
type TestB = Test<number>;

const a: TestA = {
    userId: '111',
};

const b: TestB = {
    userId: 2222,
};

```

4. 写一个计算时间的装饰器

    代码
   
5. 写一个缓存的装饰器

    代码

6. 实现一个路由跳转 通过ts约束参数的routeHelper

    大量代码, 上课写

7. 实现一个基于ts和事件模式的countdown基础类

    大量代码, 上课写
