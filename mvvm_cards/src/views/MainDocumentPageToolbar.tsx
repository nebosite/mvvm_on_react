import * as React from "react"

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

import EditableInput from "shared/EditableInput";
import AddNewCardModal from "./AddNewCardModal"

const { useState } = React;

function MainDocumentPageToolbar(props: {appModel?: IAppModel}) {
  // could be avoided by props destruction like: MainDocumentPageToolbar({ appModel }: {appModel?: IAppModel})
  const appModel = props.appModel;

  const [ allowEdit, setAllowEdit ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  
  return (
    <div className="main-document-page-toolbar" 
      onClick={() => setAllowEdit(false) }
      >
      <div className="main-document-page-toolbar-title">
        <EditableInput
          value={appModel.docTitle} 
          onChange={(val: string) => appModel.docTitle = val}
          disabled={!allowEdit}
          onKeyPress={e => {
            if (e.key === "Enter") {
              setAllowEdit(false)
            }
          }}
          onWrapperDoubleClick={e => {
            e.stopPropagation();
            setAllowEdit(true)
          }}
        />
        <i>Double click on the title to Edit</i>
      </div>
      <button onClick={() => setShowModal(true)}>Add</button>
      <button onClick={() => alert("The Save functionality is coming soon")}>Save</button>
      <button onClick={() => alert("The Load functionality is coming soon")}>Load</button>
      <button onClick={() => alert("The New functionality is coming soon")}>New</button>
      <AddNewCardModal showModal={showModal} hide={() => setShowModal(false)}/>
    </div>
  )
}

export default inject("appModel")(observer(MainDocumentPageToolbar))
