import React, { Component } from 'react';

export function Welcome1(props) {
  return (
    <div>
      <h2>{ 'Welcome1' + props.name }</h2>
    </div>
  )
}

export class Welcome2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 1
    }
  }

  render() {
    return (
      <div>
        <h2>{ 'Welcome2' + this.props.name }</h2>
      </div>
    )
  }
}