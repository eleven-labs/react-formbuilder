import ReactDOM from "react-dom";
import React from "react";

import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "./routes";

import { initConfigFormBuilder } from "./formBuilder";

import "./styles.scss";

const Root = () => <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>;

initConfigFormBuilder();

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
