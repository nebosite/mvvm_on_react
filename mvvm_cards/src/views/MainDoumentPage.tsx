import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

import { DragZone, DragElement } from "shared/drag-n-drop";

import MainDocumentPageToolbar from "./toolbar/MainDocumentPageToolbar";
import Card from "./Card";

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
    activeColRef: any

    constructor(props: any) {
      super(props);
      this.activeColRef = React.createRef();
    }

  // -------------------------------------------------------------------
  // Generate the visuals.  Binding happens here by referncing this.props
  // -------------------------------------------------------------------
  render() {
    const { appModel } = this.props; // convenient handle to appModel

    return (
      <main className='main-document-page'>
        <MainDocumentPageToolbar />

        <div className="main-document-page-column-new">
          <h5 className="col-title">New</h5>
          <DragZone>
            { appModel.cards.map(card => <DragElement><Card {...card} /></DragElement>) }  
          </DragZone>
          
        </div>
        <div ref={this.activeColRef} className="main-document-page-column-active dropzone--js"
          // onDragOver={(e) => {
          //   e.preventDefault();
          //   console.log("this.activeColRef", this.activeColRef)
          //   this.activeColRef.current.classList.add("dragover");

          // }}
          // onDrop={(e: any) => {
          //   console.log("e =>>>>>> Drop end", e);
          //   const data = e.dataTransfer.getData("text/plain");
            
          //   console.log("OVER data => ", data);
          //   this.activeColRef.current.classList.remove("dragover");
          // }}
          // onDragLeave={() => {
          //   this.activeColRef.current.classList.remove("dragover");
          // }}
          // onDragEnd={() => {
          //   this.activeColRef.current.classList.remove("dragover");
          // }}
        >
          <h5 className="col-title">Active</h5>
        </div>
        <div className="main-document-page-column-done">
          <h5 className="col-title">Done</h5>
        </div>

      </main>
    );
  }
}
