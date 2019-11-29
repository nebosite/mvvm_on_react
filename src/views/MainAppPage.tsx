// Mvvm App Component
// Purposes:
//  1 Manage navigation
//  2 Hook up to the AppModel

import React from "react";

import Home from "views/HomePage";
import About from "views/AboutPage";
import {IAppModel} from "models/i_appmodel";

import { Switch, Route, Link } from "react-router-dom";

type MainProperties = {
  appModel: IAppModel
};

export default class MainAppPage extends React.Component<MainProperties> {
  _myAppModel: IAppModel;
  constructor(props: MainProperties) {
    super(props);
  }

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
          <Route exact path="/"><Home {...this.props} /></Route>
          <Route exact path="/about"><About /></Route>
        </Switch>
      </main>
    </div>);
  };
}
