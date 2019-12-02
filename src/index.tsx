import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter as Router } from "react-router-dom";

import MainAppPage from "views/MainAppPage";
import { AppModel } from "models/appmodel";

const theAppModel = new AppModel();

ReactDOM.render(
  // to provide reactivity via mobx
  <Provider appModel={theAppModel}> 
    <Router>
      <MainAppPage />
    </Router>
  </Provider>,
  document.getElementById("root")
);