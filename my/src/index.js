import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateStoreT from "./pages/CreateStoreT";
import MobxT from "./pages/mobx/MobxT";
import MobxT2 from "./pages/mobx/MobxT/index2";

const RootEle = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/CreateStoreT" element={<CreateStoreT />} />
        <Route path="/MobxT" element={<MobxT />} />
        <Route path="/MobxT2" element={<MobxT2 />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  RootEle
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
