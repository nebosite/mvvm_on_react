import * as React from "react";
import ReactDOM from "react-dom";

type Props = {
  isShow: boolean;
  onDecline: () => void;
  onConfirm: () => void;
  children: React.ReactNode[] | React.ReactNode
}

export default function Modal(props: Props) {
  const { isShow, children, onDecline, onConfirm } = props;

  const bodyEl = document.querySelector("body");

  console.log("show => ", isShow);

  return isShow ? 
  (
    ReactDOM.createPortal(
    <div className="modal-box">
      <div className="modal-box-content">
        { children }
      </div>
      <div className="modal-box-actions">
        <button className="modal-decline-btn btn" onClick={onDecline}>Decline</button>
        <button className="modalg-confirm-btn btn" onClick={onConfirm}>Save</button>
      </div>
    </div>,
      bodyEl
    )
  )
  : null;
}