import * as React from "react";
import ReactDOM from "react-dom";

type Props = {
  onDecline: () => void;
  onConfirm: () => void;
  children: React.ReactNode[] | React.ReactNode
}

export default class MainDialog extends React.Component<Props> {
  
  render() {
    const { children, onDecline, onConfirm } = this.props;

    const bodyHTMLElement = document.querySelector("body");

    return (
      ReactDOM.createPortal(
      <div className="modal-box">
        <div className="modal-box-content">
          { children }
        </div>
        <div className="modal-box-actions">
          <button className="modal-decline-button button" onClick={onDecline}>Decline</button>
          <button className="modalg-confirm-button button" onClick={onConfirm}>Save</button>
        </div>
      </div>,
        bodyHTMLElement
      )
    );
  }
}