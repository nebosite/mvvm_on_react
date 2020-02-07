import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

import { DragZone, DragElement, DropZone } from "shared/drag-n-drop";

import MainDocumentPageToolbar from "./toolbar/MainDocumentPageToolbar";
import Card from "./Card";
import { ICard } from "models/i_card";

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
    const { appModel } = this.props; // convenient handle to appModel
    console.log("appModel => ", appModel.newCards)
    return (
      <main className='main-document-page'>
        <MainDocumentPageToolbar />

        <DropZone id="new" className="main-document-page-column  dropzone--js"
        
          onDragEnd={(card: ICard, placeIndex: number) => {
            console.log("placeIndex", placeIndex)
            appModel.moveCardToNew(card, placeIndex)
          }}

        >
          <h5 className="col-title">New</h5>
          <DragZone
              onDragStart={(card: ICard) => {
                console.log("ON DRAG START NEW", card)
                appModel.removeCardFromNew(card);
              }}
            >
            { appModel.newCards.map((card, index) => <DragElement index={index} data={card}><Card {...card} /></DragElement>) }  
          </DragZone>
          
        </DropZone>
        <DropZone id="active" className="main-document-page-column dropzone--js"
          onDragEnd={(card: ICard, placeIndex: number) => {
            appModel.moveCardToActive(card, placeIndex)
            console.log(" ACTIVE DRAG END card => ", card);
          }}
         >
         
          <h5 className="col-title">Active</h5>
          <DragZone onDragStart={(card: ICard) => {
                console.log("ON DRAG START ACTIVE")
                appModel.removeCardFromActive(card);
              }}>
            { appModel.activeCards.map((card, index) => <DragElement index={index} data={card}><Card {...card} /></DragElement>) }
            {/* <section className="drop-zone-sector" style={{ height: "100px", display: "block", backgroundColor: "orange" }}>
              A
            </section>
            <section className="drop-zone-sector" style={{ height: "100px", display: "block", backgroundColor: "blue" }}>
              B
            </section>
            <section className="drop-zone-sector" style={{ height: "100px", display: "block", backgroundColor: "violet" }}>
              C
            </section> */}
          </DragZone>
        </DropZone>
        <div id="done" className="main-document-page-column">
          <h5 className="col-title">Done</h5>
        </div>

      </main>
    );
  }
}
