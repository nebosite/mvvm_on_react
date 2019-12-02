// App Navigation handled here
import React from "react";
import { observer, inject } from "mobx-react";
import { Switch, Route, Link } from "react-router-dom";

import Home from "views/HomePage";
import About from "views/AboutPage";
import { IAppModel } from "models/i_appmodel";

@inject("appModel")
@observer
export default class MainAppPage 
  extends React.Component<{appModel?: IAppModel}> {

  handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.appModel.mousePosition.x = event.pageX;
    this.props.appModel.mousePosition.y = event.pageY;
  };

  render() {
    return (
      <div className="app" onMouseMove={ this.handleMouseMove }>
        <header className="app-header">
          <h1>MVVM Example</h1>
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
