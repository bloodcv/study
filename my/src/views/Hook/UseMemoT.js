import { Button, Input } from "antd";
import { useMemo, useState } from "react";

// useMemo 可以做一些影响性能的运算 避免无关因素引起的不必要的计算  类似于 vue 的 computed
export default function UseMemoT() {
  const [ count, setCount ] = useState(0);
  const [ value, setValue ] = useState(0);

  // 总数 total 依赖于两个值  其中一个变化 都会重新计算
  const total = useMemo(() => +count + +value, [count, value]);

  const onClick = () => {
    setCount(count + 1)
  }

  const onChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <>
      <Button onClick={onClick}>count点击增加: {count}</Button>
      <Input onChange={onChange} type="number" value={value} />
      <h5>{ total }</h5>
    </>
  )
}