import React, { Component } from 'react'

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        date: new Date()
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <div>
        <h5>{ this.state.date.toLocaleTimeString() }</h5>
        <h5>{ this.state.date.toLocaleTimeString('chinese', { hour12: false }) }</h5>
        <h5>{ this.state.date.toLocaleDateString() }</h5>
        <h5>{ this.state.date.toLocaleString() }</h5>
        <h5>{ this.state.date.toLocaleString('chinese', { hour12: false }) }</h5>
      </div>
    )
  }
}