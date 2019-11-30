// Mvvm App Component
// Purposes:
//  1 Manage navigation
//  2 Hook up to the AppModel

import React from "react";

import { observer, inject } from "mobx-react";

import Home from "views/HomePage";
import About from "views/AboutPage";
import { IAppModel } from "models/i_appmodel";

import { Switch, Route, Link } from "react-router-dom";

type MainProperties = {
  /* 'shallow-optional' because the component will receive the appModel from the Provider. 
    Without it we'll receive a TS error about missed prop as we aren't passing anything manually. Mobx does it.
   */
  appModel?: IAppModel
};

// TODO: delete after reading. 
// let's make this class 'reactive' via observer and we need to inject the appModel via Mobx
@inject("appModel")
@observer
export default class MainAppPage extends React.Component<MainProperties> {
  _myAppModel: IAppModel;
  //TODO: Delete after reading. As we don't do anything with constructor it could be ommited
  // constructor(props: MainProperties) {
  //   super(props);
  // }

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
