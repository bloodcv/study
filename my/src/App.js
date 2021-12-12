import React, { Component } from 'react';
import './App.css';
// import Clock from './components/Clock';
// import StateTest from './components/StateTest';
// import { Welcome1, Welcome2 } from './components/CompType';
// import CartSample from './components/CartSample';
// import HookTest from './components/HookTest';
import NewForm from './components/KForm';

export default class App extends Component {
  /* constructor(props) {
    super(props);
  } */

  render() {
    return (
      <div className="App">
        {/* <Clock/> */}
        {/* <h2>{ this.props.title }</h2> */}
        {/* <StateTest /> */}
        {/* <Welcome1 name="welcome1name" /> */}
        {/* <Welcome2 name="welcome2name" /> */}
        {/* <CartSample title="购物" /> */}
        {/* <HookTest /> */}
        <NewForm />
      </div>
    );
  }
}


