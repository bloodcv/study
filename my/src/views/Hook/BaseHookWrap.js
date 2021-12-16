import { Component, useEffect, useState } from "react";
const useLog = (props) => {
  useEffect(() => {
    console.log(props);
  });
};

const useErrorBoundary = (reactNode) => {
  const [ErrorBoundary] = useState(
    () =>
      class ErrorBoundary extends Component {
        state = {
          error: false,
        };
        componentDidCatch(error, errorInfo) {
          this.setState({ error: true }, () => {
            console.log("logErrorToMyService", error, errorInfo); //
          });
        }
        render() {
          return this.state.error ? (
            <p>{Component.displayName}</p>
          ) : (
            this.props.children
          );
        }
      }
  );
  return <ErrorBoundary>{reactNode}</ErrorBoundary>;
};
function BaseHook(props) {
  useLog(props);

  const realReactNode = useErrorBoundary(
    <ul>
      {props.list.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  );
  return realReactNode;

  /* return (
    <ul>
      {props.list.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  ); */
}

class BaseHookWrap extends Component {
  state = {
    list: [
      {
        id: 1,
        name: 111,
      },
      {
        id: 2,
        name: 222,
      },
    ],
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        list: [
          ...this.state.list,
          {
            id: 3,
            name: 333,
          },
        ],
      });
    }, 3000);
  }

  render() {
    return <BaseHook list={this.state.list} />;
  }
}

export default BaseHookWrap;
