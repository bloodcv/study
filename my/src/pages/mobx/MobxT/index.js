/* import { Button } from "antd";
import { observable, reaction } from "mobx";

const data = observable({ value: 0 });
const dispose = reaction(
  () => data.value,
  (cur, prev) => {
    console.log(cur, prev);
    if (cur > 3) {
      dispose();
      console.log("不再追踪 data");
    }
  }
);

export default function MobxT() {
  const onChange = () => {
    data.value++;
  };
  return <Button onClick={onChange}>改变 data {data.value}</Button>;
} */

/* import { Button } from 'antd';
import { observable, reaction } from 'mobx';

const data = observable({
  value: 0
})

const dispose = reaction(
  () => data.value,
  (cur, pre) => {
    console.log(`cur: ${cur} && pre: ${pre}`)
    if (cur > 3) {
      dispose()
      console.log('不再追踪data')
    }
  }
)

export default function MobxT() {
  const onAdd = () => {
    data.value ++
  }

  return (
    <Button onClick={onAdd}> value：{ data.value } </Button>
  )
} */

/**
 * 以上代码
 * 可以看到，点击按钮时，控制台打印了 data.value 的值，但是组件并没有同步显示。回顾状态管理的主线
 * （创建 state、注⼊ state、UI 与 state 的同步），我们分析这⼀过程：
 */

/* 
// 1. 创建 state
const data = observable({ value: 0 });

// 2. 注⼊ state
<button onClick={onChange}>改变 data { data.value }</button>

// 3. UI 与 state 的同步
？？ onChange 是更新状态的，那么 state => UI 这⼀步这⾥是没有的
*/

/**
 * 补上 UI 与 state 同步的逻辑：
 * import { observer } from 'mobx-react';
 * ...
 * export default observer(function Mobx() {
 * ...
 * });
 * 完整如下:
 */
/* import { Button } from "antd";
import { observable, reaction } from "mobx";
import { observer } from "mobx-react";

const data = observable({
  value: 0,
});

const dispose = reaction(
  () => data.value,
  (cur, pre) => {
    console.log(`cur: ${cur} && pre: ${pre}`);
    if (cur > 3) {
      dispose();
      console.log("不再追踪data");
    }
  }
);

function MobxT() {
  const onAdd = () => {
    data.value++;
  };

  return <Button onClick={onAdd}> value：{data.value} </Button>;
}

export default observer(MobxT); */

/**
 * 这⾥的 observer 与 react-redux 中的 subscribe 订阅更新⽅法起到了⼀样的作⽤：当状态变更时，subscribe
 * listeners 通知组件更新，⽽ observer 将重新执⾏我们传给它的函数（这⾥是 Mobx 组件）。不同的是，我们将完
 * 全抛弃诸如 setState，useState 等原⽣⽅法更新组件。
 */

// 错误示范 && 正确示范
/* import { Button } from "antd";
import { observable, reaction } from "mobx";
import { observer } from "mobx-react";

const data = observable({
  value: 0,
});

const dispose = reaction(
  () => data.value,
  (cur, pre) => {
    console.log(`cur: ${cur} && pre: ${pre}`);
    if (cur > 3) {
      dispose();
      console.log("不再追踪data");
    }
  }
);
const value = data.value; // 错误
export default observer(function Mobx() {
  // const value = data.value; // 正确
  const onAdd = () => {
    data.value++;
  };
  return <Button onClick={onAdd}>改变 data{value}</Button>;
}); */

/**
 * 上⾯两个示例的唯⼀区别就是，将 value 属性的访问置于 observer 内或外。如果是外部，observer 内本质是
 * 使⽤了⼀个基本类型的值 value，它不具有响应能⼒；⽽ data.value 在 observer 内被访问，将会在初次渲染时触
 * 发 observer 对 Mobx 函数的追踪，便于后续 value 属性发⽣变化时，重新执⾏ Mobx。这⾥我们可以重新审视⼀
 * 下代理的本质：
 */

/* const data = { value: 0 };

const proxyData = new Proxy(data, {
  get(target, key) {
    const result = target[key];
    // 此时进⾏ track
    console.log("get 取值属性名", key, ", 值: ", result);
    return result;
  },
  set(target, key, value) {
    // 此时进⾏ trigger
    console.log("set 修改属性名", key, ", 值: ", value);
    return Reflect.set(target, key, value);
  },
});
console.log('proxyData.value', proxyData.value); // 取值
setTimeout(() => {
  proxyData.value = 3; // 改值
  console.log('proxyData.value-change', proxyData.value)
}, 3000);

export default function MobxT() {
  const dataShow = data;
  return (
    <h1>{ dataShow.value }</h1>
  )
} */

/**
 * 针对对象属性的访问进⾏拦截，因此在拦截步骤中，应该出现形如 obj[key] 或 obj.key 形式的访问，这样
 * track 过程才能正确地将类组件的 render ⽅法或者 observer 的参数（函数组件）添加到副作⽤列表。所以基本类
 * 型的值，必须经历⼀次对象的包装，才能被代理：
 */
/* import { observable } from "mobx";
import { observer } from "mobx-react";

const primitive = observable.box(0);
// 如果你了解过 Vue3 的 ref ⽅法，你也就理解这种做法和实现原理了。
export default observer(function Mobx() {
  const value = primitive.get(); // 取值⽅式
  const onChange = () => {
    primitive.set(value + 1); // 更新⽅式
  };
  return <button onClick={onChange}>改变 data{value}</button>;
}); */
/* import { Button } from "antd";
import { observable } from "mobx";
import { observer } from "mobx-react";

const primitive = observable.box(0);

function MobxT() {
  const value = primitive.get();
  const onAdd = () => {
    primitive.set(value + 1)
  }
  return (
    <Button onClick={ onAdd }> value: { value } </Button>
  )
}

export default observer(MobxT); */

/**
 * 实践中，react 组件的状态应当在加载时创建，卸载后销毁，因此推荐的写法是外部定义 State 类，组件内再
 * 实例化状态：
 */
/* import React, { Component } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

// 创建 state
class State {
  constructor() {
    makeAutoObservable(this); // 这是 mobx 6.x 的⽅式，可以代替下⾯的所有声明：
    // this.value = observable.box(0);
    // this.data = observable({});
  }
  value = 0;
  onChange = () => {
    this.value++;
  };
}

class Mobx extends Component {
  state = new State(); // 注⼊ state
  render() {
    return (
      <button onClick={this.state.onChange}>改变 data{this.state.value}</button>
    );
  }
}

export default observer(Mobx); // state 同步 */

/**
 * 为了规范性，开启严格模式下，修改状态的⽅法应当使⽤ action 来修饰，明确这是⼀个触发组件更新的⽅
 * 法，绑定 this 可以使⽤ action.bound。
 * import { configure } from 'mobx';
 * // 开启后，action 外部修改状态将会抛出错误
 * configure({ enforceActions: true });
 */

// class + mobx
import React, { Component } from "react";
import { makeObservable, action, observable } from "mobx";
import { observer } from "mobx-react";
// 创建 state
class State {
  constructor() {
    // 这⾥不是⾃动处理，⽽是⼈为控制哪些数据具有响应能⼒，哪些⽅法是修改状态的
    makeObservable(this, {
      value: observable,
      // 注意 onChangeValue 不是属性声明的箭头函数，所以应当绑定 state 实例
      onChangeValue: action.bound,
    });
  }
  count = 0;
  value = 0;
  onChangeValue() {
    this.value++;
  }
  onChangeCount = () => {
    this.count++;
  };
}

@observer // state 同步
class Mobx extends Component {
  state = new State(); // 注⼊ state
  render() {
    return (
      <>
        <button onClick={this.state.onChangeValue}>
          改变 value{this.state.value}
        </button>
        &nbsp;
        <button onClick={this.state.onChangeCount}>
          改变 count{this.state.count}
        </button>
      </>
    );
  }
}

export default Mobx;

/**
 * 在上⾯的例⼦中，makeObservable 定义了响应能⼒的属性和⽅法，count 是普通属性，所以改变 count 按钮
 * 并不会看到⻚⾯有任何变化。相⽐于粗暴地使⽤ makeAutoObservable，能够使开发者更清晰地知道⾃⼰在⼲什
 * 么，从⽽达到节约性能的⽬的。那么，如果我们要实现请求的控制该怎么做呢？
 * 转 同级目录 index2.js
 */
