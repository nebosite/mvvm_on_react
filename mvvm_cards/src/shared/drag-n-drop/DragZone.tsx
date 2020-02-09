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

// info about the drag object
type State = {
  dragObject: DragObject
}

// TODO: maybe move to utils etc. ?
function getElementCSSBox(element: HTMLElement) { 
  const box = element.getBoundingClientRect();
  return box;

}

type DragElementMouseDownEvent = React.MouseEvent & {
  data: {
    element: HTMLElement;
    data: any; // a data of the drag element
  }
}

function moveAt(e: DragElementMouseDownEvent, 
                element: HTMLElement, 
                shiftX: number, 
                shiftY: number
                ) {
  element.style.left = e.pageX - shiftX + "px";
  element.style.top = e.pageY - shiftY + "px";
}

// Typescript custom guard
function isNotDragElementClick(e: DragElementMouseDownEvent | React.MouseEvent<HTMLElement>): e is React.MouseEvent<HTMLElement> {
  return (e as DragElementMouseDownEvent).data === undefined;
}

export default class DragZone extends React.Component<Props, State> {

  dragZoneRef: React.RefObject<HTMLDivElement> = React.createRef();
  // state = {
  //   dragObject: {}
  // }

  avatar: any;

  // to recognize if we are dragging or no
  isMouseHoldPressed: boolean = false;

  dragObject: DragObject;
  // position of mouse down event
  downX: number;
  downY: number;

  // the element click shift from the left top corner
  shiftX: number;
  shiftY: number;

  // componentWillUnmount() {
  //   // to avoind memory leak on the component re-mount
  //   document.removeEventListener("mousemove", this.handleDocumentMouseMove);
  //   document.removeEventListener("mouseup", this.handleDocumentMouseUp);
  // }

  handleDocumentMouseMove = (e: any) => {
    const { element, data } = this.dragObject;
    

    // break if we don't have the dnd element or isn't pressing
    if (!element || !this.isMouseHoldPressed) return; 

    // console.log("document.onMouseMove", e);
    // don't do anything if the user misclicked
    if (Math.abs(e.pageX - this.downX) < 3 && Math.abs(e.pageY - this.downY) < 3) {
      return;
    }

    // the element is pressed by the user didn't start to move it
    if (!this.avatar) {
      this.avatar = this.createAvatar(element, e, data);
      bus.data.avatar = this.avatar;

      if (!this.avatar) {
        // can't receive the avatar. Clean everything and stop the program.
        this.cleanUp();
      } else {
        this.props.onDragStart(data);
      }
    }


    // moving the avatar
    this.avatar.onDragMove(e);


    // console.log("Wa can start dnd and try to take the element avatar", this.avatar)
    // TODO: Implement dnd avatar
    // moveAt(e, element, this.shiftX, this.shiftY)

  }

  // a small factory
  createAvatar(element: HTMLElement | null, e: any, data: any) {
    // to allow CSS know about the active dragging process
    document.documentElement.classList.add("active-dragging");
    return element ? new DragAvatar(this.dragZoneRef.current, element, e, data) : null;
  }

  cleanUp() {
    // TODO: logic
    this.dragObject.element.classList.remove("dragging")
    this.isMouseHoldPressed = false;

    this.dragObject = null;

    document.onmousemove = null;
    document.onmouseup = null

    // removing the avatar element from the DOMTree as we don't need it anymore
    this.avatar.element.remove()
    this.avatar = null;
    bus.reset()
  }

  // TODO. Maybe need to move it to the Avatar ?
  handleDocumentMouseUp = (e: any) => {

    // we didn't stat to drag. Just a single click etc.
    if (!this.avatar) {
      this.isMouseHoldPressed = false;
      return;
    };

    // the element under the cursor
    const targetElement: any = getElementUnderClientXY(this.dragObject.element, e.clientX, e.clientY);
    // trying to find the dropzone of the element under the cursor.
    // It MIGHT be undefined when there is no such dropzone. Eg. dragend outside of any dropzone
    const dropZoneElement = findClosestParent(targetElement, ".drop-zone");
    
    if (dropZoneElement) {
      // passing the ID to the manager to clarify what exactly dropzone should handle it
      bus.triggerDragEndByDropZoneId(dropZoneElement.id, this.avatar.currentPlaceIndex)
      // just a quick DEMO that this proof of concept works
      
      // dropElem.appendChild(this.dragObject.element)
      // restore the element margin
      // element.style.margin = elementMarginStr



      
    } else {
      this.rollback();
    }

 
    this.cleanUp();
       
  }

  rollback() {
    const parentDropZone = this.avatar.getParentDropZone();
    const initialPlaceIndex = this.avatar.initialPlaceIndex;
    // need to place it exactly where it was
    bus.triggerDragEndByDropZoneId(parentDropZone.id, initialPlaceIndex)
  }

  // generateDragObject = (element: HTMLElement, data: any) => ({
  //     element: element,
  //     data: data,
  //     documentEdges: {
  //       left: 0,
  //       top: 0,
  //       right: document.documentElement.clientWidth,
  //       bottom: document.documentElement.clientHeight
  //     }
  //   })

  handleMouseDown = (e: DragElementMouseDownEvent | React.MouseEvent<HTMLElement> ) => {
    // gold pass. We want to handle bubbling only of the DragElement. We don't need to handle click on outer area
    if ( isNotDragElementClick(e) ) return;

    this.isMouseHoldPressed = true;


    const { element, data } = e.data;

    // non primary button was pressed.  Don't do anything 
    if (e.button  !== 0) { 
      return false;
    }

    this.downX = e.pageX;
    this.downY = e.pageY;

    // If I implement the separated document handlers
    // return false;
    
    // TODO: move to bus I guess
    this.dragObject = {
      element: element,
      data: data,
      documentEdges: {
        left: 0,
        top: 0,
        right: document.documentElement.clientWidth, // it should be calculated at the mouseclick only
        bottom: document.documentElement.clientHeight
      }
    };
    


    // need to know the mouse shift regarding the element coorditates
    // to give it the correct absolute coords after appending to the body el
    // this.shiftX = e.pageX - elementCSSBox.left;
    // this.shiftY = e.pageY - elementCSSBox.top;
    
    // // TODO: maybe add padding/margin to dragElement ?
    // const elementPaddingValueStr = window.getComputedStyle(element, null).getPropertyValue("padding")
    // const elementTotalPadding = parseInt(elementPaddingValueStr) * 2;
    
    // // let's rembmer initial element margin
    // const elementMarginStr = window.getComputedStyle(element, null).getPropertyValue("margin")


    // // const totalElementMarginShift = dragElementTotalMargin + elementTotalPadding;
    
    //     // TODO: don't forget to do something with the margin

    // element.classList.add("dragging")
    // element.style.position = "absolute"
    // // reset the element margin to avoid incorrect position
    // element.style.margin = "0"
    // element.style.width = elementCSSBox.width - elementTotalPadding + "px"
    // element.style.height = elementCSSBox.height - elementTotalPadding + "px"

    // // moving it to the body to avoid unnecessary relative affect, etc.
    // document.body.append(element);

    // // set the render priority to maximum. The card shouldn't overlap by any element
    // element.style.zIndex = "1000"
    // moveAt(e, element, this.shiftX, this.shiftY);



    document.onmousemove = this.handleDocumentMouseMove

    // document.onmousemove = function mouseMoveCallback(e: any) {

    // //   moveAt(e, element, shiftX, shiftY)
    // };


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