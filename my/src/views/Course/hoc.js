import React, { Component } from 'react';
import { getCoursePageData } from '../../data';

export default function Hoc(WrappedComponent, api) {
  return class extends Component {
    state = {
      query: {
        name: '',
        id: '',
        time: '',
        valid: ''
      },
      dataSource: []
    }

    onChange = (query) => {
      this.setState(state => ({
        query: { ...state.query, ...query }
      }))
      getCoursePageData({ api }).then(res => {
        console.log('===onChange in===', res)
        this.setState({
          dataSource: res
        })
      })
    }

    componentDidMount() {
      this.onChange(this.state.query)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onChange={this.onChange}
        />
      )
    }
  }
}