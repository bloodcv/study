import { Button, Input } from "antd";
import { Component, createRef, forwardRef, useImperativeHandle, useRef } from "react";

const Sub = forwardRef((props, ref) => {
  const input = useRef();

  // 不使用 useImperativeHandle 透传 ref，会导致父组件中可以随意使用子组件 ref 对象中的方法，违背了实例的封闭原则
  // 这里切断 子组件 input 标签和父组件 ref 的直接关联，让子组件只能拿到自身的 input 所对应的 ref对象引用
  useImperativeHandle(ref, () => ({
    focus() {
      input.current.focus()
    }
  }))

  return <Input {...props} ref={input} />
})
export default class UseImperativeHandleT extends Component {
  input = createRef();

  onFocus = () => {
    // 这里引用的 input 不再直接是子组件的 input 标签对象，而是 useImperativeHandle 第二个参数暴露出来的对象
    // 这样的话  父组件就无权访问 子组件 input 标签除 focus 以外的方法
    this.input.current.focus();
  }

  render() {
    return (
      <>
        <Sub ref={this.input} />
        <Button onClick={this.onFocus}>点击聚焦input</Button>
      </>
    )
  }
}