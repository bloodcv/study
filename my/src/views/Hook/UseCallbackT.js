import { Button, Input } from "antd";
import { memo, useCallback, useState } from "react";

/* const UseCallbackSub = memo(({ onChange, value }) => {
  console.log('组件更新:', value)
  return <Input onChange={onChange} value={value} />
}, (pre, next) => pre.value === next.value)  */
const UseCallbackSub = memo(({ onChange, value }) => {
  console.log('组件更新:', value)
  return <Input onChange={onChange} value={value} />
}) 

export default function UseCallbackT() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(0);

  // 修改 count 值，父组件会更新
  // 但是子组件也会发生更新，产生不必要的渲染
  // 可以用 memo 包裹子组件， memo 会对 props 进行对比，不发生变化则不更新组件，避免因为父组件的重新渲染导致子组件的更新
  // useCallback 可以对函数进行缓存，保证组件更新的时候不会改变函数的引用

  // 如果不使用 useCallback，可以使用 memo 的自定义比较决定更新与否
  const onChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  /* const onChange = (e) => {
    setValue(e.target.value)
  } */

  const onClick = () => {
    setCount(count + 1)
  }

  return (
    <>
      <Button onClick={onClick}>count点击: {count}</Button>
      <UseCallbackSub onChange={onChange} value={value} />
    </>
  )
}