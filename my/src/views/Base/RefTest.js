// 父组件通过点击聚焦按钮可以使子组件内的输入框聚焦

import React, { Component, createRef, forwardRef } from "react";
import { Button } from 'antd';

const InsertLog = (WrappedComponent) => {
  class Log extends Component {
    componentDidUpdate(...args) {
      console.log("InsertLog:", ...args);
    }

    componentDidMount() {
      console.log('InsertLog componentDidMount')
    }

    render() {
      const { forwardRef, ...props } = this.props;
      return (
        <WrappedComponent {...props} ref={forwardRef} />
      );
    }
  };
  return forwardRef((props, ref) => <Log {...props} forwardRef={ref} />)
}

class Sub extends Component {
  input = createRef();

  // focus 方法会让input元素聚焦
  focus = () => {
    this.input.current.focus()
  }

  render() {
    return <input { ...this.props } ref={ this.input } />
  }
}

//可以写在外面或者parent 里面
const SubWithLog = InsertLog(Sub);
class Parent extends Component {
  state = {
    value: ''
  }

  // 引用子组件实例，便于调用子组件上的方法 
  input = createRef()

  // SubWithLog = InsertLog(Sub);

  onChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  onFocus = () => {
    this.input.current.focus();
  }

  render() {
    // 高阶组件写在内部 每次render都会返回新的被包装过的Sub  会失去Sub中的状态
    return (
      <>
        {/* <Sub */}
        <SubWithLog
          value={ this.state.value }
          onChange={this.onChange}
          ref={this.input}
        />
        <Button type="primary" onClick={this.onFocus}>点击聚焦</Button>
      </>
    )
  }
}

export default Parent;