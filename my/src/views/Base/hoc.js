import React, { Component } from "react";

export function insertErrorBoundary(WrappedComponent) {
  return class extends Component {
    state = {
      error: false,
    };

    componentDidCatch(error, errorInfo) {
      this.setState({ error: true }, () => {
        console.log("logErrorService", {
          error,
          errorInfo,
        });
      });
    }

    componentDidMount() {
      console.log('insertErrorBoundary componentDidMount')
    }

    render() {
      if (this.state.error) {
        return <p>页面不可用，请检查组件{ Component.displayName }的逻辑</p>;
      } else {
        return <WrappedComponent {...this.props} />;
      }
    }
  };
}

export const InsertLog = (WrappedComponent) => {
  return class extends Component {
    componentDidUpdate(...args) {
      console.log("InsertLog:", ...args);
    }

    componentDidMount() {
      console.log('InsertLog componentDidMount')
    }

    render() {
      const { ...props } = this.props
      return (
        <WrappedComponent {...props} />
      );
    }
  };
}