import React, { Component } from "react";
import { insertErrorBoundary, InsertLog } from "./hoc";

/* @insertErrorBoundary
@InsertLog */
class Base extends Component {
  state = {
    list: [{
      id: 1,
      value: 111
    },{
      id: 2,
      value: 222
    }],
    error: false,
    text: 'init'
  }

  componentDidMount() {
    console.log('Base componentDidMount')
    setTimeout(() => {
      this.setState({
        list: [...this.state.list, {
          id: 3,
          value: 333
        }],
        text: '5000'
      })
    }, 5000)
  }

  // 写在这里有反应
  /* componentDidUpdate(...args) {
    console.log("InsertLog:", ...args);
  } */

  // 写在这里有反应
  /* componentDidCatch(error, errorInfo) {
    this.setState({ error: true }, () => {
      console.log("Base logErrorService", {
        error,
        errorInfo,
      });
    });
  } */

  render() {
    const { list, text } = this.state
    return (
      <>
        <ul>
          {list.map((item) => (
            <li key={item.id}>{item.value}</li>
          ))}
        </ul>
        <h3>{ text }</h3>
      </>
    );
  }
}

export default insertErrorBoundary(InsertLog(Base));
