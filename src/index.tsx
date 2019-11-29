import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter as Router } from "react-router-dom";

import MainAppPage from "views/MainAppPage";

import rootStore from "stores";
import { AppModel } from "models/appmodel";

const theAppModel = new AppModel();

ReactDOM.render(
  <Provider {...rootStore}>
    <Router>
      <MainAppPage appModel= {theAppModel} />
    </Router>
  </Provider>,
  document.getElementById("root")
);