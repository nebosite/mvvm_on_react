import * as React from "react";
import { findDroppable, getElementUnderClientXY } from "shared/util"

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



export default class DragZone extends React.Component<Props, State> {

  dragZoneRef: React.RefObject<HTMLDivElement> = React.createRef();
  // state = {
  //   dragObject: {}
  // }

  avatar: any;

  dragObject: DragObject;
  // position of mouse down event
  downX: number;
  downY: number;

  // the element click shift from the left top corner
  shiftX: number;
  shiftY: number;

  // componentDidMount() {
  //   document.addEventListener("mousemove", this.handleDocumentMouseMove);
  //   document.addEventListener("mouseup", this.handleDocumentMouseUp);
  // }

  // componentWillUnmount() {
  //   // to avoind memory leak on the component re-mount
  //   document.removeEventListener("mousemove", this.handleDocumentMouseMove);
  //   document.removeEventListener("mouseup", this.handleDocumentMouseUp);
  // }

  handleDocumentMouseMove = (e: any) => {
    const { element, data } = this.dragObject;

    // break if we don't have the dnd element
    if (!element) return; 

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
    return element ? new DragAvatar(this.dragZoneRef.current, element, e, data) : null;
  }

  cleanUp() {
    // TODO: logic
    console.log("Clear Everything")
    this.dragObject.element.classList.remove("dragging")

    this.dragObject = null;

    document.onmousemove = null;
    document.onmouseup = null

    this.avatar = null;
    bus.reset()
  }

  // TODO. Maybe need to move it to the Avatar ?
  handleDocumentMouseUp = (e: any) => {
    console.log("document.MouseUp", e);

    const dropElem = getElementUnderClientXY(this.dragObject.element, e.clientX, e.clientY);
    console.log("dropElem =>> ", dropElem);

    if (dropElem) {
      // passing the ID to the manager to clarify what exactly dropzone should handle it
      bus.triggerDragEndByDropZoneId(dropElem.id)
      // just a quick DEMO that this proof of concept works
      
      console.log('=>> dropElem', dropElem);
      
      // dropElem.appendChild(this.dragObject.element)
      // restore the element margin
      // element.style.margin = elementMarginStr

      // removing the avatar element from the DOMTree as we don't need it anymore
      this.dragObject.element.remove()

      
    } else {
      // alert("Doesn't found droppable area")
    }

 
    this.cleanUp();
       
  }


  handleMouseDown = (e: DragElementMouseDownEvent ) => {
    const { element, data } = e.data;

    console.log("MouseDown")
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
      data: data
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

    return (
      <div className="drag-zone"
          ref={this.dragZoneRef}
          onMouseDown={this.handleMouseDown as any}
        >
        { children }
      </div>
    )
  }
}