import { Button } from 'antd';
import { Component } from 'react';
import store from './store'

class CreateStoreT extends Component {
  componentDidMount() {
    store.subscribe(() => {
      // 组件的强制更新方法
      this.forceUpdate()
    })
  }

  onAdd = () => {
    store.dispatch({
      type: 'ADD'
    })
  }

  render() {
    return (
      <div >
        <h3>store-count: { store.getState().count }</h3>
        <Button onClick={this.onAdd}>点击增加</Button>
      </div>
    );
  }
}

export default CreateStoreT;
