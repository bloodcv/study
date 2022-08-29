/** @jsxRuntime classic */
import MyReact from './MyReact';
/** @jsx MyReact.createElement */

class Count4 extends MyReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    }
  }

  onClickHandler = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div>
        <h3>Count: {this.state.count}</h3>
        <button onClick={this.onClickHandler}>Count+1</button>
      </div>
    ); 
  }
}

// export的时候用transfer包装下
export default MyReact.transfer(Count4);

