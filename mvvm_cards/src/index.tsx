import "assets/styles/index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter as Router } from "react-router-dom";

import MainDocumentPage from "views/MainDoumentPage";
import { AppModel } from "models/AppModel";

const theAppModel = new AppModel();

ReactDOM.render(
  // to provide reactivity via mobx
  <Provider appModel={theAppModel}> 
    <Router>
      <MainDocumentPage />
    </Router>
  </Provider>,
  document.getElementById("root")
);
