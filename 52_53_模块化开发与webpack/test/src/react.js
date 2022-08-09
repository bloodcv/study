import React from "react";
import { render } from "react-dom";
import './index.css';
import App from './App';

// const App = () => <div>App</div>;
render(<App />, document.querySelector("#app"));

console.log('module.hot', module.hot);
if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector("#app"));
  });
}
