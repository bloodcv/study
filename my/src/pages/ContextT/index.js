/* context 的使用方式很灵活，可以通过 Provider/Consumer，也可以通过 contextTypes/getChildContext，
useContext 等方式，具体哪种可以根据便利性决定。如 */

import { createContext, useContext, useState } from "react";

const Context = createContext();
// ⼦组件通过 context 拿到上层数据
function Sub() {
  const ctx = useContext(Context); // 也可以使⽤ Consumer 来获取 context 对象
  return (
    <div>
      {ctx.count}
      <button onClick={ctx.increment}>增加</button>
      <button onClick={ctx.decrement}>减少</button>
    </div>
  );
}
// ⽗组件通过 Context.Provider 传递数据到下级、后代组件
export default function Parent() {
  const [count, setCount] = useState(0);
  const value = {
    count,
    increment() {
      setCount((c) => c + 1);
    },
    decrement() {
      setCount((c) => c - 1);
    },
  };

  return (
    <Context.Provider value={value}>
      <Sub />
    </Context.Provider>
  );
}
