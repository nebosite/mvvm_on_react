// App Navigation handled here
import React from "react";
import { observer, inject } from "mobx-react";
import { Switch, Route, Link } from "react-router-dom";

import Home from "views/HomePage";
import About from "views/AboutPage";
import { IAppModel } from "models/i_appmodel";

// -------------------------------------------------------------------
// The main page is just a router to the sub pages.  
//
// Note: Mobx decorators automatically cause child controls to
// inherit the appModel created in index.tsx.
// -------------------------------------------------------------------

@inject("appModel")
@observer
export default class MainAppPage 
  extends React.Component<{appModel?: IAppModel}> {

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Cards</h1>
          <nav>
                <Link className="nav-link" to="/">Home</Link> |&nbsp; 
                <Link className="nav-link" to="/about">About</Link>
          </nav>
        </header>

        <main>
          <Switch>
            <Route exact path="/"><Home /></Route>
            <Route exact path="/about"><About /></Route>
          </Switch>
        </main>
      </div>
    );
  };
}
