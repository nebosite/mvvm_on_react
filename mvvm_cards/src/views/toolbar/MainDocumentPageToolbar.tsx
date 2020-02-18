import * as React from "react"

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

import EditableInput from "shared/EditableInput";
import AddNewCardModalDialog from "./AddNewCardModalDialog"

type Props = {
  appModel?: IAppModel;
}

type State = {
  allowEdit: Boolean;
  showDialog: Boolean;
}

class MainDocumentPageToolbar extends React.Component<Props, State> {

  state = {
    allowEdit: false,
    showDialog: false
  }

  setAllowEdit = (allow: Boolean) => {
    this.setState({
      allowEdit: allow
    })
  }

  setShowDialog = (show: Boolean) => {
    this.setState({
      showDialog: show
    })

  }

  render() {
    const appModel = this.props.appModel;
    const { allowEdit, showDialog } = this.state;

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
        <button className="button" onClick={() => this.setShowDialog(true)}>Add</button>
        <button className="button" onClick={() => alert("The Save functionality is coming soon")}>Save</button>
        <button className="button" onClick={() => alert("The Load functionality is coming soon")}>Load</button>
        <button className="button" onClick={() => alert("The New functionality is coming soon")}>New</button>
        <AddNewCardModalDialog 
          showDialog={showDialog} 
          addCard={appModel.createNewCard}
          hide={() => this.setShowDialog(false)}
        />
      </div>
    )
  }
  
}

export default inject("appModel")(observer(MainDocumentPageToolbar))
