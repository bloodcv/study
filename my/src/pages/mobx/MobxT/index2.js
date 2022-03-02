/**
 * 在indexs的例⼦中，makeObservable 定义了响应能⼒的属性和⽅法，count 是普通属性，所以改变 count 按钮
 * 并不会看到⻚⾯有任何变化。相⽐于粗暴地使⽤ makeAutoObservable，能够使开发者更清晰地知道⾃⼰在⼲什
 * 么，从⽽达到节约性能的⽬的。那么，如果我们要实现请求的控制该怎么做呢？
 */

import React, { Component } from "react";
import { makeObservable, action, observable, flow, computed } from "mobx";
import { observer } from "mobx-react";

// 假装这是⼀个请求接⼝
const api = (name = '') => new Promise((resolve) => {
  setTimeout(() => {
    const length = Math.ceil(Math.random() * 10);
    resolve({
      code: 200,
      data: Array(length)
        .fill(0)
        .map((_, idx) => ({ name: `${name}-${Math.ceil(Math.random() * 1000)}`, id: idx })),
    });
  }, 3000);
});

class State {
  constructor() {
    // 这⾥不是⾃动处理，⽽是⼈为控制哪些数据具有响应能⼒，哪些⽅法是修改状态的
    makeObservable(this, {
      list: observable,
      loading: observable,
      assign: action.bound, // 如果你⽐较懒，这么⼲也不是不可以，该⽅法不是必须的
      overflow: computed, // 顺带把衍⽣值学了，衍⽣的属性只能访问，不要直接修改
    });
  }
  list = [];
  loading = false;
  get overflow() {
    return this.list.length > 30; // list ⻓度变化就会重新计算
  }
  // flow 是优雅地处理异步 action 的⽅法，所以这⾥相当于内部的代码也运⾏在 action 的作⽤内。
  onFetch = flow(function* (string) {
    this.loading = true;
    const { data } = yield api(string); // 异常处理⾃⼰做~
    this.list = data;
    this.loading = false;
    // 或者 this.assign({ list: data, loading: false });
  });
  // 这样定义⼀个⽅法，会失去语义性，即你都不知道⾃⼰在做什么，只知道是在修改⼀个值
  assign(obj) {
    Object.assign(this, obj);
  }
}

// @observer
class Mobx extends Component {
  state = new State();
  render() {
    if (this.state.loading) {
      return <p>loading...</p>;
    }
    return (
      <>
        <div>
          {this.state.list.map((item) => (
            <p key={item.id}>{item.name}</p>
          ))}
        </div>
        <button onClick={() => this.state.onFetch("响应")}>获取数据</button>
      </>
    );
  }
}

export default observer(Mobx);
