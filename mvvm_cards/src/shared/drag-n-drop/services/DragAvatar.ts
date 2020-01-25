// This service should create a drag avatar
import { findDroppable, getElementUnderClientXY } from "shared/util"

export default class DragAvatar {
  
  // the element parent zone. 
  parentDragZone: HTMLElement

  // this is the dragzone sector where was our drag element
  // Can be used when we won't drop the element somewhere 
  // in this case we need to return the element back

  // by default it's the whole dragZone
  dragZoneSector: HTMLElement;


  // the element that will be dragged.
  // In the simples solution it will be the same element that we clicked on
  // But we can create some different avatar if needed as well and hide the original one
  element: HTMLElement; 

  // an element that below the this.element while mouse move event
  currentTargetElement: Element
  prevTargetElement: Element

  shiftX: number;
  shiftY: number;

  constructor(parentDragZone: HTMLElement, dragElement: HTMLElement, e: any) {
    this.parentDragZone = parentDragZone;
    this.dragZoneSector = parentDragZone;
    // we can clone the drag el to create some other View and hide the original if necessary
    this.element = dragElement;

    this.initFromEvent(e)
  }

  initFromEvent(e: any) {
    const elementCSSBox = this.element.getBoundingClientRect();
    // need to know the mouse shift regarding the element coorditates
    // to give it the correct absolute coords after appending to the body el
    this.shiftX = e.pageX - elementCSSBox.left;
    this.shiftY = e.pageY - elementCSSBox.top;
    
    // TODO: maybe add padding/margin to dragElement ?
    const elementPaddingValueStr = window.getComputedStyle(this.element, null).getPropertyValue("padding")
    const elementTotalPadding = parseInt(elementPaddingValueStr) * 2;
    
    // let's rembmer initial element margin
    const elementMarginStr = window.getComputedStyle(this.element, null).getPropertyValue("margin")


    // const totalElementMarginShift = dragElementTotalMargin + elementTotalPadding;
    
        // TODO: don't forget to do something with the margin

    this.element.classList.add("dragging")
    this.element.style.position = "absolute"
    // reset the element margin to avoid incorrect position
    this.element.style.margin = "0"
    this.element.style.width = elementCSSBox.width - elementTotalPadding + "px"
    this.element.style.height = elementCSSBox.height - elementTotalPadding + "px"

    // moving it to the body to avoid unnecessary relative affect, etc.
    document.body.append(this.element);

    // set the render priority to maximum. The card shouldn't overlap by any element
    this.element.style.zIndex = "1000"

  }

  // return some info about the dragging. 
  // Could contain any info that necessary to finish the dnd, etc.
  getDragInfo = () => {
    return {
      parentDragZone: this.parentDragZone,
      dragZoneSector: this.dragZoneSector,
      element: this.element
    }
  }

  // get the current target element
  getCurrentTargetElement = () => this.currentTargetElement;
  getPrevTargetElement = () => this.prevTargetElement;

  // on the each drag move event it moves this.element and records
  // the current element below this.element to this.currentTargetElement
  onDragMove = (e: any) => {
    
    this.element.style.left = e.pageX - this.shiftX + "px";
    this.element.style.top = e.pageY - this.shiftY + "px";

    // the element under the dragging element
    const targetElement = getElementUnderClientXY(this.element, e.clientX, e.clientY);

    // if the target element wasn't saved before we need to handle it
    if ( this.currentTargetElement !== targetElement ) {
     
      // save the previous target element. To let the dropzone to remove highlight from it as the element left this area
     this.prevTargetElement = this.currentTargetElement;

      // remember this new target element
      this.currentTargetElement = targetElement
     
     this.currentTargetElement = targetElement

     
    }

    
  }
  
}


