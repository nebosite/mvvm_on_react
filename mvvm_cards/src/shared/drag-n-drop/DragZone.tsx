import * as React from "react";
import { findClosestParent, getElementUnderClientXY } from "shared/util"

import { DragElementMouseDownEventType, DragObjectDataType } from "./types"

import DragAvatar from "./services/DragAvatar";

// TODO: implement DI
import bus from "./services/bus";

type Props<T> = {
  children: React.ReactNode | React.ReactNode[];
  onDragStart: (data?: T) => void;
}

// Typescript custom guard
function isNotDragElementClick<T>(e: DragElementMouseDownEventType<T> | React.MouseEvent<HTMLElement>): e is React.MouseEvent<HTMLElement> {
  return (e as DragElementMouseDownEventType<T>).data === undefined;
}

export default class DragZone<T> extends React.Component<Props<T>> {

  dragZoneRef: React.RefObject<HTMLDivElement> = React.createRef();

  dragObjectData: DragObjectDataType<T>;
  

  // to recognize if we are dragging or no
  isMouseHoldPressed: boolean = false;
  

  handleDocumentMouseMove = (e: MouseEvent) => {
    const { element, data, initialPageX, initialPageY } = this.dragObjectData;
    
    // break if we don't have the dnd element or isn't pressing
    if (!element || !this.isMouseHoldPressed) return; 

    // don't do anything if the user misclicked and doesn't drag the element
    const isNotDragging = Math.abs(e.pageX - initialPageX) < 3 && Math.abs(e.pageY - initialPageY) < 3;
    if (isNotDragging) return;
    
    // the element is pressed by the user didn't start to move it
    if (!bus.avatar) {

      bus.avatar = this.createAvatar(element, e, data);
      this.props.onDragStart(data);
    }


    // moving the avatar
    bus.avatar.onDragMove(e);
  }

  // a small factory
  createAvatar(element: HTMLElement, e: MouseEvent, data: T) {
    // to allow CSS know about the active dragging process
    document.documentElement.classList.add("active-dragging");
    return new DragAvatar<T>(this.dragZoneRef.current, element, e, data);
  }

  cleanUp() {
    this.isMouseHoldPressed = false;

    this.dragObjectData = null;

    document.onmousemove = null;
    document.onmouseup = null

    bus.reset()
  }

  // TODO. Maybe need to move it to the Avatar ?
  handleDocumentMouseUp = (e: MouseEvent) => {

    // we didn't stat to drag. Just a single click etc.
    if (!bus.avatar) {
      this.isMouseHoldPressed = false;
      return;
    };

    // the element under the cursor
    const targetElement: HTMLElement = getElementUnderClientXY(this.dragObjectData.element, e.clientX, e.clientY);
    // trying to find the dropzone of the element under the cursor.
    // It MIGHT be undefined when there is no such dropzone. Eg. dragend outside of any dropzone
    const dropZoneElement = findClosestParent(targetElement, ".drop-zone");
    
    if (dropZoneElement) {
      // passing the ID to the manager to clarify what exactly dropzone should handle it
      bus.triggerDragEndByDropZoneId(dropZoneElement.id, bus.avatar.currentPlaceIndex)

    } else {
      this.rollback();
    }

 
    this.cleanUp();
  }

  rollback() {
    const parentDropZone = bus.avatar.getParentDropZone();
    const initialPlaceIndex = bus.avatar.initialPlaceIndex;

    // need to place it exactly where it was
    bus.triggerDragEndByDropZoneId(parentDropZone.id, initialPlaceIndex)
  }


  handleMouseDown = (e: DragElementMouseDownEventType<T> | React.MouseEvent<HTMLElement> ) => {
    // gold pass. We want to handle bubbling only of the DragElement. 
    // We don't need to handle click on outer area
    if ( isNotDragElementClick(e) ) return;

    // to know if the mouse button holds or it's just a click
    this.isMouseHoldPressed = true;

    const { element, data } = e.data;

    // non primary mouse button was pressed.  Don't do anything 
    if (e.button  !== 0) return;

    this.dragObjectData = {
      element,
      data,
      initialPageX: e.pageX,
      initialPageY: e.pageY
    }

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
          onMouseDown={this.handleMouseDown}
        >
        { children }
        <div className="drag-zone-spacer-bottom" data-index={spacerIndex} />
      </div>
    )
  }
}