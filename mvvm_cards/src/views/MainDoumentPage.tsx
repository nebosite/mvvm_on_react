import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

import MainDocumentPageToolbar from "./MainDocumentPageToolbar";


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
export default class MainDocumentPage 
  extends React.Component<{appModel?: IAppModel}> {


  // -------------------------------------------------------------------
  // Generate the visuals.  Binding happens here by referncing this.props
  // -------------------------------------------------------------------
  render() {
    // const { appModel } = this.props; // convenient handle to appModel

    return (
      <main className='main-document-page'>
        <MainDocumentPageToolbar />

        <div className="main-document-page-column-new"><b>New</b></div>
        <div className="main-document-page-column-active"><b>Active</b></div>
        <div className="main-document-page-column-done"><b>Done</b></div>

      </main>
    );
  }
}
