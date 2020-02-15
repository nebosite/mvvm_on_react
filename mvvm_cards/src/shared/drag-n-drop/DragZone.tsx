import * as React from "react";
import { findClosestParent, getElementUnderClientXY } from "shared/util"

import DragAvatar from "./services/DragAvatar";

// TODO: implement DI
import bus from "./services/bus";
import { ICard } from "models/i_card";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  onDragStart: (card?: ICard) => void;
}

type DragObject = {
  element: HTMLElement;
  data: any;
  documentEdges: any; // a border values of the document
} | null;


type DragElementMouseDownEvent = React.MouseEvent & {
  data: {
    element: HTMLElement;
    data: any; // a data of the drag element
  }
}

// Typescript custom guard
function isNotDragElementClick(e: DragElementMouseDownEvent | React.MouseEvent<HTMLElement>): e is React.MouseEvent<HTMLElement> {
  return (e as DragElementMouseDownEvent).data === undefined;
}

export default class DragZone extends React.Component<Props> {

  dragZoneRef: React.RefObject<HTMLDivElement> = React.createRef();

  avatar: any;

  // to recognize if we are dragging or no
  isMouseHoldPressed: boolean = false;
  

  handleDocumentMouseMove = (e: any) => {
    const { element, data } = bus.dragObject;
    
    // break if we don't have the dnd element or isn't pressing
    if (!element || !this.isMouseHoldPressed) return; 

    // don't do anything if the user misclicked and doesn't drag the element
    const isNotDragging = Math.abs(e.pageX - bus.mouseData.pageX) < 3 && Math.abs(e.pageY - bus.mouseData.pageY) < 3;
    if (isNotDragging) return;
    
    // the element is pressed by the user didn't start to move it
    if (!bus.data.avatar) {

      bus.data.avatar = this.createAvatar(element, e, data);
      this.props.onDragStart(data);
    }


    // moving the avatar
    bus.data.avatar.onDragMove(e);
  }

  // a small factory
  createAvatar(element: HTMLElement, e: any, data: any) {
       // to allow CSS know about the active dragging process
    document.documentElement.classList.add("active-dragging");
    return new DragAvatar(this.dragZoneRef.current, element, e, data);
  }

  cleanUp() {
    // TODO: logic
    // this.dragObject.element.classList.remove("dragging")
    this.isMouseHoldPressed = false;

    // this.dragObject = null;

    document.onmousemove = null;
    document.onmouseup = null

    // removing the avatar element from the DOMTree as we don't need it anymore
    // this.avatar.element.remove()
    // this.avatar = null;
    bus.reset()
  }

  // TODO. Maybe need to move it to the Avatar ?
  handleDocumentMouseUp = (e: any) => {

    // we didn't stat to drag. Just a single click etc.
    if (!bus.data.avatar) {
      this.isMouseHoldPressed = false;
      return;
    };

    // the element under the cursor
    const targetElement: any = getElementUnderClientXY(bus.dragObject.element, e.clientX, e.clientY);
    // trying to find the dropzone of the element under the cursor.
    // It MIGHT be undefined when there is no such dropzone. Eg. dragend outside of any dropzone
    const dropZoneElement = findClosestParent(targetElement, ".drop-zone");
    
    if (dropZoneElement) {
      // passing the ID to the manager to clarify what exactly dropzone should handle it
      bus.triggerDragEndByDropZoneId(dropZoneElement.id, bus.data.avatar.currentPlaceIndex)

    } else {
      this.rollback();
    }

 
    this.cleanUp();
  }

  rollback() {
    const parentDropZone = bus.data.avatar.getParentDropZone();
    const initialPlaceIndex = bus.data.avatar.initialPlaceIndex;

    // need to place it exactly where it was
    bus.triggerDragEndByDropZoneId(parentDropZone.id, initialPlaceIndex)
  }


  handleMouseDown = (e: DragElementMouseDownEvent | React.MouseEvent<HTMLElement> ) => {
    // gold pass. We want to handle bubbling only of the DragElement. 
    // We don't need to handle click on outer area
    if ( isNotDragElementClick(e) ) return;

    // to know if the mouse button holds or it's just a click
    this.isMouseHoldPressed = true;

    const { element, data } = e.data;

    // non primary mouse button was pressed.  Don't do anything 
    if (e.button  !== 0) return;

    // TODO: maybe sync these things?
    bus.extractMouseCoordsFromEvent(e);
    bus.setDragObject(element, data)

    document.onmousemove = this.handleDocumentMouseMove
    document.onmouseup = this.handleDocumentMouseUp;
  }

  render() {
    const { children } = this.props;
    // an index of the spacer. Useful to know what index we need to set for Drag Avatar
    // if there are no elements under the cursor (maybe at the top we have a few Drag avatars)
    const spacerIndex = Object.keys(children).length

    return (
      <div className="drag-zone"
          ref={this.dragZoneRef}
          onMouseDown={this.handleMouseDown as any}
        >
        { children }
        <div className="drag-zone-spacer-bottom" data-index={spacerIndex} />
      </div>
    )
  }
}