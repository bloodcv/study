# 问题总结

## mvvm的原理或者核心模式

- 观察者模式/发布订阅模式（实际例子 vue  react  angular）

## 观察者模式的实现/如何实现响应式

## template  render  分别如何生成 dom

template 会通过compiler转成render function  回去做一些优化算法 性能处理

## 咱们在 vue 脚手架新建项目的时候 会选择 compiler 是 runtime only 还是 runtime + compiler  这两个有什么区别 在哪个文件里面做了区分

## beforeCreate 和 created 之间做了什么  二者有什么区别

## computed 和 watch 区别

## props 和 data 是如何把属性挂载在 vm 上的
- 通过 proxy

## vm.$options   为什么 data 是函数 而 components 是对象  data 函数如果没有返回值 会报错么

- 如果两个实例是同名的data  那么属性就会被引用 改了一个组件的值 另一个也会受到影响 而函数 就是生成新的实例  隔离了

- components  是相同的组件  不过是在不同的状态下出现  组件本质是通过传参实现功能  可以引用同一个

## beforeDestroy 和 destroyed 之间做了什么  二者有什么区别

## vue的实例为何不能挂载在 body 或者 html 节点上，如果挂载在这上面 会报错吗

因为 vue 会替换 实例挂载的节点

## beforeMount 和 mounted 之间做了什么  二者有什么区别

new Watcher

## 什么是 虚拟节点（请简述 虚拟dom 的构成）、vue 和 react 虚拟dom 的区别

## 对于被监听数据  他的  __ob__ 是在什么时候被加上的（__ob__ 是什么  有什么作用）

是个标识 标识这是个被监听的数据
