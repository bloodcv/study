import React, { Component } from 'react'

export default class StateTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 1
    }
  }

  componentDidMount() {
    /* this.setState({
      count: this.state.count + 1
    }) */

    /* this.setState({
      count: this.state.count + 1
    }, () => {
      console.log(this.state.count)
      this.setState({
        count: this.state.count + 1
      }, () => {
        console.log(this.state.count)
        this.setState({
          count: this.state.count + 1
        }, () => {
          console.log(this.state.count)
          this.setState({
            count: this.state.count + 1
          }, () => {
            console.log(this.state.count)
          })
        })
      })
    }) */

    /* this.setState(preState => ({
      count: preState.count + 1
    }))
    this.setState(preState => ({
      count: preState.count + 1
    }))
    this.setState(preState => ({
      count: preState.count + 1
    }))
    this.setState(preState => ({
      count: preState.count + 1
    }))
    this.setState(preState => ({
      count: preState.count + 1
    })) */
  }

  render() {
    return (
      <div>
        <h2>{ this.state.count }</h2>
      </div>
    )
  }
}