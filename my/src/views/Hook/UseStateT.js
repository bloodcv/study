import { Button } from "antd";
import { useState } from "react";

function UseStateT() {
  const [count, setCount] = useState(0);
  return <Button type="primary" onClick={() => setCount(c => c + 1)}>加一: {count}</Button>
}

export default UseStateT;