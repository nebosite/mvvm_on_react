import * as React from "react"

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

import EditableInput from "shared/EditableInput";
import AddNewCardModal from "./AddNewCardModal"

type Props = {
  appModel?: IAppModel;
}

type State = {
  allowEdit: Boolean;
  showModal: Boolean;
}

class MainDocumentPageToolbar extends React.Component<Props> {

  state = {
    allowEdit: false,
    showModal: false
  }

  setAllowEdit = (allow: Boolean) => {
    this.setState({
      allowEdit: allow
    })
  }

  setShowModal = (show: Boolean) => {
    this.setState({
      showModal: show
    })

  }

  render() {
    const appModel = this.props.appModel;
    const { allowEdit, showModal } = this.state;

    return (
      <div className="main-document-page-toolbar" 
        // in the case of complex apps we shouldn't use the lambda in views
        // because it creates a new function each time at re-render
        // in general it's not a problem but in the very complex app even a small 
        // blog of performance increasing matters
        onClick={() => this.setAllowEdit(false)}
        >
        <div className="main-document-page-toolbar-title">
          <EditableInput
            value={appModel.docTitle} 
            onChange={(val: string) => appModel.docTitle = val}
            disabled={!allowEdit}
            onKeyPress={e => {
              if (e.key === "Enter") {
                this.setAllowEdit(false)
              }
            }}
            onWrapperDoubleClick={e => {
              e.stopPropagation();
              this.setAllowEdit(true)
            }}
          />
          <i>Double click on the title to Edit</i>
        </div>
        <button className="button" onClick={() => this.setShowModal(true)}>Add</button>
        <button className="button" onClick={() => alert("The Save functionality is coming soon")}>Save</button>
        <button className="button" onClick={() => alert("The Load functionality is coming soon")}>Load</button>
        <button className="button" onClick={() => alert("The New functionality is coming soon")}>New</button>
        { showModal && <AddNewCardModal hide={() => this.setShowModal(false)} addCard={appModel.addCard} /> }
      </div>
    )
  }
  
}

export default inject("appModel")(observer(MainDocumentPageToolbar))
