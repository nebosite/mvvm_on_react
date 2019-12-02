import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter as Router } from "react-router-dom";

import MainAppPage from "views/MainAppPage";

import { AppModel } from "models/appmodel";

// TODO: Delete after reading. We could do it in the appmodel file. + your class namings etc. a bit strange.
// Usually Classes file names has PaskalCase format and it let's us know that it's a Class or Component. 
// if it's a singleton and it exports the instance of itself so we can use camelCase
// it was FYI
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