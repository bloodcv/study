import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Test1Item from "./component/Test1Item";
import reportWebVitals from "./reportWebVitals";
import Test1 from "./views/Test1";
import Test2 from "./views/Test2";
import Page1 from "./views/Course/Page1";
import Page2 from "./views/Course/Page2";
import Base from "./views/Base/base"
import Parent from "./views/Base/RefTest";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="test1" element={<Test1 />}>
            <Route
              index
              element={
                <main style={{ padding: "1rem" }}>
                  <p>Select an invoice</p>
                </main>
              }
            />
            <Route path=":test1Id" element={<Test1Item />} />
          </Route>
          <Route path="test2" element={<Test2 />} />
          <Route path="page1" element={<Page1 />} />
          <Route path="page2" element={<Page2 />} />
          <Route path="base" element={<Base />} />
          <Route path="reftest" element={<Parent/>} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
