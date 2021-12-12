import React, { useEffect, useState } from 'react'

export default function HookTest() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = count
  }, [count])

  return (
    <div>
      <h3>{ count }</h3>
      <button onClick={() => setCount(count + 1)}>点击增加count</button>
    </div>
  )
}


// 自己实现一个简单的useState

/* const stateArray = [];
const cursor = 0;

function useState(initialState) {
  const crtCursor = cursor;
  stateArray[crtCursor] = stateArray[crtCursor] || initialState;

  function setState(newState) {
    stateArray[crtCursor] = newState
    // render()
  }

  cursor++

  return [stateArray[crtCursor], setState]
} */