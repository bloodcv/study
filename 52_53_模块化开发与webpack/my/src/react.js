/* import React, { lazy, Suspense } from "react";
import { render } from "react-dom";
import './reset.css';

const Async = lazy(() => import('./Async'))
const App = () => <div className="red">
  App:
  <Suspense fallback={<>loading</>}>
    <Async />
  </Suspense>
</div>;

render(
  <App />,
  document.querySelector('#app')
)

if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector('#app'))
  })
} */
/** 
 * 一般App是外部引入的
 * import App from './App'
 * if (module.hot) {
 *   module.hot.accept(App, () => {
 *     render(<App />, document.querySelector('#app'))
 *   })
 * } 
*/

import React from "react";
import { render } from "react-dom";
import loadComponent from "./loadComponent";
import './reset.css';

const Async = loadComponent(() => import('./Async'))
const App = () => <div className="red">
  App:<Async />
</div>;

render(
  <App />,
  document.querySelector('#app')
)

if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector('#app'))
  })
}
