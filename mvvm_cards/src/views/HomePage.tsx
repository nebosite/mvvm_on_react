import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";


// -------------------------------------------------------------------
// The home page Component
//
// The page is bound to an IAppModel object, which is passed in as
// a prop.  Binding is achieved simply by referencing this.props in the
// render() function.
// -------------------------------------------------------------------

// @inject decorator is needed for automatic dependency injection- see the Provider
// element in index.tsx
@inject("appModel") 

// @observer decorator is needed to recieve updates when the underlying model changes
@observer
export default class Home 
  extends React.Component<{appModel?: IAppModel}> {


  // -------------------------------------------------------------------
  // Generate the visuals.  Binding happens here by referncing this.props
  // -------------------------------------------------------------------
  render() {
    const { appModel } = this.props; // convenient handle to appModel

    return (
      <div className="home">
        <h2>Home Page</h2>
          Here are some examples of hooking page elements to a view model:
          <br />
          <b>App model bound data</b>: { appModel.data }
          <br />
          <button onClick={appModel.changeData}>Change test data</button>
      </div>
    );
  }
}
