import { Button } from "antd";
import { useEffect, useState } from "react";

function UseEffectT() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);

  // 本组件第一次加载、组件更新的时候会执行
  useEffect(() => {
    console.log(`mount + update: ${count}`)
  })

  // 本组件第一次加载的时候执行一次
  useEffect(() => {
    console.log(`mount: ${count}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 本组件第一次加载、count更新的时候会执行
  useEffect(() => {
    console.log(`mount + count update: ${count}`)
  }, [count])

  return (
    <>
      <Button onClick={() => setCount(count + 1)}>count 更新{count}</Button>
      <Button onClick={() => setNum(num + 1)}>num 更新{num}</Button>
    </>
  )
}

export default UseEffectT;