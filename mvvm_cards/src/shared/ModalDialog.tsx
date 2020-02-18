import * as React from "react";
import ReactDOM from "react-dom";

type Props = {
  onDecline: () => void;
  onConfirm: () => void;
  children: React.ReactNode[] | React.ReactNode
}

export default class ModalDialog extends React.Component<Props> {
  
  render() {
    const { children, onDecline, onConfirm } = this.props;

    const bodyHTMLElement = document.querySelector("body");

    if (children === null) {
      // can return children themself because they are null, but decided to
      // make it a bit more obvious
      return null;
    }

    return (
      ReactDOM.createPortal(
        <div className="modal-dialog-box">
          <div className="modal-dialog-box-content">
            { children }
          </div>
          <div className="modal-dialog-box-actions">
            <button className="modal-dialog-decline-button button" onClick={onDecline}>Decline</button>
            <button className="modal-dialog-confirm-button button" onClick={onConfirm}>Save</button>
          </div>
        </div>,
        bodyHTMLElement
      )
    );
  }
}