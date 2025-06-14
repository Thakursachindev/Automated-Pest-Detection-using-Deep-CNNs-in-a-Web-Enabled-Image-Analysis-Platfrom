// /src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Layout from "./layout/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Layout>
      <App />
    </Layout>
  </Router>
);
