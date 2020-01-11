import * as React from "react"

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

import EditableInput from "shared/EditableInput";
import AddNewCardModal from "./AddNewCardModal"

const { useState, useCallback } = React;

function MainDocumentPageToolbar(props: {appModel?: IAppModel}) {
  // could be avoided by props destruction like: MainDocumentPageToolbar({ appModel }: {appModel?: IAppModel})
  const appModel = props.appModel;

  const [ allowEdit, setAllowEdit ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);

  // a demonstration how to create the callback only once and won't re-create it at re-render
  const hide = useCallback(() => setShowModal(false), []);
  
  return (
    <div className="main-document-page-toolbar" 
      // it's possible to use such way in case of callbacks as well
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
      <button className="btn" onClick={() => setShowModal(true)}>Add</button>
      <button className="btn" onClick={() => alert("The Save functionality is coming soon")}>Save</button>
      <button className="btn" onClick={() => alert("The Load functionality is coming soon")}>Load</button>
      <button className="btn" onClick={() => alert("The New functionality is coming soon")}>New</button>
      { showModal && <AddNewCardModal hide={hide}/> }
    </div>
  )
}

export default inject("appModel")(observer(MainDocumentPageToolbar))
