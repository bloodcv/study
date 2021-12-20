import { Button } from "antd";
import React, { useEffect, useRef, useState } from "react";

// useRef 挂载dom节点 作用类似于 createRef
/* function UseRefT1() {
  const container = useRef(null);
  console.log('before container:', container)

  useEffect(() => {
    console.log('mount container:', container)
  }, [])

  return <Button ref={container}>Ref 容器</Button>
} */


// 模拟；类组件的this 充当持久化的数据对象
export default function UseRefT() {
  const [ count, setCount ] = useState(0);
  const container = useRef(false);
  
  useEffect(() => {
    if (container.current) {
      console.log('模拟 componentDidUpdate, 除了初始化，其他时候的更新都会走到这里')
    } else {
      console.log('初始化，会走到这里')
      container.current = true;
    }
  })

  return <Button onClick={() => setCount(count + 1)}>Count：{ count }</Button>
}


