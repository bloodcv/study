// -----0----- 函数式组件
/* import React from 'react';
import ReactDOM from 'react-dom';

const container = document.querySelector('#root')

function App () {
  return (
    <div>函数式组件<h1>内容</h1></div>
  )
}
console.log((<App/>).type())
ReactDOM.render(<App/>, container) */

// ----1----
/* import React from 'react';
import ReactDOM from 'react-dom/client';  */
/* import MyReact from "./MyReact";

const element = MyReact.createElement(
  'div',
  {
    title: 'hello',
    id: 'sky'
  },
  '成功啦',
  MyReact.createElement(
    'a',
    {
      className: 'is-a-tag'
    },
    '我是a标签'
  )
)

const container = document.querySelector('#root')

console.log('element', element)
MyReact.render(element, container); */

// ----2----
/** @  jsxRuntime classic */
// import MyReact from "./MyReact";

/** @  jsx MyReact.createElement */

/* const container = document.querySelector('#root');

const updateValue = (e) => {
  renderfun(e.target.value)
}

const renderfun = value => {
  const element = (
    <div>
      <input onInput={updateValue} />
      <h1>内容在这里:   { value }</h1>
    </div>
  )
  console.log('element-renderfun', element)
  MyReact.render(element, container);
}

renderfun('开始吧') */

// ---3---

/* import MyReact from "./MyReact";

function App(props) {
  return (
    <div>
      <h1 id="title">{props.title}</h1>
    </div>
  );
}

MyReact.render(
  <App title="Fiber Demo"/>,
  document.getElementById('root')
); */

// --- 验证函数式组件 ---
/** @   jsxRuntime classic */
// import MyReact from "./MyReact";

/** @   jsx MyReact.createElement */

/* const container = document.querySelector('#root');

function App(props) {
  let a = 1;

  const addA = () => {
    console.log('addA', a)
    a = a + 1;
  }

  console.log('reload')
  return (
    <div>
      <h1 id="title">{props.title}</h1>
      <a href="xxx">Jump</a>
      <section>
        <p> Article</p>
      </section>
      <button onClick={addA}>加一</button>
      <h1>a: { a }</h1>
    </div>
  );
}
MyReact.render(<App title="Fiber Demo" />, container); */


// ----验证 useState----

/** @jsxRuntime classic */
import MyReact from './MyReact';
import Count4 from './Count4';

/** @jsx MyReact.createElement */

function Count3() {
  const [count, setCount] = MyReact.useState(1);
  
  const onClickHandler = () => {
    setCount(count + 1);
  }

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={onClickHandler}>Count+1</button>
    </div>
  );
}

function Count() {
  const [count, setCount] = MyReact.useState(1);
  const [count2, setCount2] = MyReact.useState(1);
  
  const onClickHandler = () => {
    setCount(count + 1);
  }

  const onClickHandler2 = () => {
    setCount2(count2 + 1);
  }

  return (
    <div>
      <h3>Count1: {count}</h3>
      <button onClick={onClickHandler}>Count1+1</button>
      <h3>Count2: {count2}</h3>
      <button onClick={onClickHandler2}>Count2+1</button>
    </div>
  );
}

function App(props) {
  return (
    <div>
      <h1 id="title">{props.title}</h1>
      <hr></hr>
      <section>
        <h2>函数组件1</h2>
        <Count></Count>
        <hr></hr>
        <h2>函数组件2</h2>
        <Count3></Count3>
        <hr></hr>
        <h2>Class组件</h2>
        <Count4></Count4>
      </section>
    </div>
  );
}

MyReact.render(
  <App title="Fiber Demo"/>,
  document.getElementById('root')
);

