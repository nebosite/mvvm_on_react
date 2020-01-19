import * as React from "react";
import { findDroppable } from "shared/util"

type Props = {
  children: React.ReactNode | React.ReactNode[];
}

type DragObject = {
  element: HTMLElement
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
    elementCSSBox: any;
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

  // state = {
  //   dragObject: {}
  // }

  dragObject: DragObject;

  handleMouseDown = (e: DragElementMouseDownEvent ) => {
    const { element, elementCSSBox } = e.data;

    // TODO: maybe need to clone it
    this.dragObject = {
      element: element
    };
    
    // need to know the mouse shift regarding the element coorditates
    // to give it the correct absolute coords after appending to the body el
    const shiftX = e.pageX - elementCSSBox.left;
    const shiftY = e.pageY - elementCSSBox.top;
    
    // TODO: maybe add padding/margin to dragElement ?
    const elementPaddingValueStr = window.getComputedStyle(element, null).getPropertyValue("padding")
    const elementTotalPadding = parseInt(elementPaddingValueStr) * 2;
    
    // let's rembmer initial element margin
    const elementMarginStr = window.getComputedStyle(element, null).getPropertyValue("margin")


    // const totalElementMarginShift = dragElementTotalMargin + elementTotalPadding;
    
        // TODO: don't forget to do something with the margin

    element.classList.add("dragging")
    element.style.position = "absolute"
    // reset the element margin to avoid incorrect position
    element.style.margin = "0"
    element.style.width = elementCSSBox.width - elementTotalPadding + "px"
    element.style.height = elementCSSBox.height - elementTotalPadding + "px"

    // moving it to the body to avoid unnecessary relative affect, etc.
    document.body.append(element);

    // set the render priority to maximum. The card shouldn't overlap by any element
    element.style.zIndex = "1000"
    moveAt(e, element, shiftX, shiftY);

    document.onmousemove = function mouseMoveCallback(e: any) {
      moveAt(e, element, shiftX, shiftY)
    };

    function finishDrag(e: any) {
      const dropElem = findDroppable(e);
     
       if (dropElem) {
         // just a quick DEMO that this proof of concept works
         dropElem.appendChild(element)
         // restore the element margin
         element.style.margin = elementMarginStr
         element.style.position = "static"
 
         
       } else {
         // alert("Doesn't found droppable area")
       }
 
       
     }



         // reset all handlers
    document.onmouseup = (e: any) => {
      // e.persist()

      // current drag event
      if (this.dragObject?.element) {
        finishDrag(e);
      }

      // reset object
      this.dragObject = null;

      document.onmousemove = null;
      document.onmouseup = null
      element.classList.remove("dragging")
      
    }

  }

  render() {
    const { children } = this.props;

    return (
      <div className="drag-zone"
          onMouseDown={this.handleMouseDown as any}
        >
        { children }
      </div>
    )
  }
}