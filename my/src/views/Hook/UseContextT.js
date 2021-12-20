import { Button, Divider } from "antd";
import { createContext, useContext, useState } from "react";

// context 提供跨组件传递信息的能力  需要搭配 createContext useContext 使用

// 创建共享数据源对象
const ContextObj = createContext();

export default function UseContextT() {
  const [ count, setCount ] = useState(0);

  const store = {
    count,
    setCount
  }

  return (
    // 父组件使用 Provider 包裹所有子组件
    // 注入数据源到根组件
    <ContextObj.Provider value={store}>
      <Divider />
      <h3>Father: {count}</h3>
      <Button onClick={() => setCount(count + 1)}>parent count点击增加</Button>
      <Sub1 />
    </ContextObj.Provider>
  )

}

function Sub1() {
  // 子组件通过 useContext 调用数据源对象 获取数据，这里没有使用 props
  const ctx = useContext(ContextObj);

  return (
    <>
      <Divider />
      <h3>Sub1: { ctx.count }</h3>
      <Button onClick={() => ctx.setCount(c => c + 1)}>Sub1 count点击增加</Button>
      <Sub2 />
    </>
  )
}

function Sub2() {
  const ctx = useContext(ContextObj);

  return (
    <>
      <Divider />
      <h3>Sub2: { ctx.count }</h3>
      <Button onClick={() => ctx.setCount(c => c + 1)}>Sub2 count点击增加</Button>
    </>
  )
}