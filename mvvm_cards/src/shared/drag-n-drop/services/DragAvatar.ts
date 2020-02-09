// This service should create a drag avatar
import { findClosestParent, getElementUnderClientXY } from "shared/util"

export default class DragAvatar {
  
  // the element parent zone. 
  parentDragZone: HTMLElement

  // this is the dragzone sector where was our drag element
  // Can be used when we won't drop the element somewhere 
  // in this case we need to return the element back

  // by default it's the whole dragZone
  dragZoneSector: HTMLElement;

  // Data that should be handler on drag end
  data: any;


  // the original element that shouldn't be moved because of the React VDom
  originalElement: HTMLElement;

  // the element that will be dragged.
  // In the simples solution it will be the same element that we clicked on
  // But we can create some different avatar if needed as well and hide the original one
  element: HTMLElement; 

  // an element that below the this.element while mouse move event
  currentTargetElement: HTMLElement
  prevTargetElement: HTMLElement

  shiftX: number;
  shiftY: number;

  // a position in the cards list. Need to know it to put at the proper place
  initialPlaceIndex: number;
  currentPlaceIndex: number;

  // highlight type
  highlightType: string;

  // TODO: options
  constructor(parentDragZone: HTMLElement, dragElement: HTMLElement, e: any, data: any) {
    this.parentDragZone = parentDragZone;
    this.dragZoneSector = parentDragZone;
    this.data = data;
    // we can clone the drag el to create some other View and hide the original if necessary
    this.originalElement = dragElement;
    this.initialPlaceIndex = +dragElement.dataset.index;
    this.element = dragElement.cloneNode(true) as HTMLElement;

    this.initFromEvent(e)
  }

  getParentDropZone = () => findClosestParent(this.parentDragZone, ".drop-zone");

  initFromEvent(e: any) {
    const elementCSSBox = this.originalElement.getBoundingClientRect();
    // need to know the mouse shift regarding the element coorditates
    // to give it the correct absolute coords after appending to the body el
    this.shiftX = e.pageX - elementCSSBox.left;
    this.shiftY = e.pageY - elementCSSBox.top;
    
    // TODO: maybe add padding/margin to dragElement ?
    const elementPaddingValueStr = window.getComputedStyle(this.originalElement, null).getPropertyValue("padding")
    const elementTotalPadding = parseInt(elementPaddingValueStr) * 2;
    
    // let's rembmer initial element margin
    const elementMarginStr = window.getComputedStyle(this.originalElement, null).getPropertyValue("margin")


    // const totalElementMarginShift = dragElementTotalMargin + elementTotalPadding;
    
        // TODO: don't forget to do something with the margin

    this.element.classList.add("dragging")
    this.element.style.position = "absolute"
    // reset the element margin to avoid incorrect position
    this.element.style.margin = "0"
    this.element.style.width = elementCSSBox.width - elementTotalPadding + "px"
    this.element.style.height = elementCSSBox.height - elementTotalPadding + "px"

    // hiding the original element but we can't delete it regarding react VDom
    // this.originalElement.style.display = "none";

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

  private highlightDropPosition = (highlightType: string) => {
    const currentTargetElement = this.getCurrentTargetElement()
    const prevTargetElement = this.getPrevTargetElement()


    currentTargetElement.dataset.highlight = highlightType;
    // this.highlightedEl = currentTargetElement;


    // console.log('1', isInDropZone(currentTargetElement, this.rootElementRef.current))
    // it could be null on the first dropzone-sector enter.
    // TODO. maybe move to pub/sub pattern via BUS?
    if (prevTargetElement) {
      // console.log("prevTargetElement => ", prevTargetElement)
      prevTargetElement.dataset.highlight = null;
    }
  }


  // TODO: probably move to BUS. JSDOC
  // returns an array of the allowed left and top position of the drag avatar
  private getAvatarLeftAndTopPos = (pageX: number, pageY: number): [number, number] => {

    const documentClientW = document.documentElement.clientWidth;
    const documentClientH = document.documentElement.clientHeight;

    // we shouldn't move a card at the left|top document edges
    let left = pageX < 0 ? 0 : pageX;
    let top = pageY < 0 ? 0 : pageY;

    // we shouldn't move a card farest than the client right edge
    if ( left >= documentClientW ) { 
      left = documentClientW;
     }

    // we shouldn't move a card farest than the client top edge
    if ( top >= documentClientH ) { 
      top = documentClientH;
     }

     return [ left, top ];
  }


  // on the each drag move event it moves this.element and records
  // the current element below this.element to this.currentTargetElement
  onDragMove = (e: any) => {
    
    const [ leftPos, topPos ] = this.getAvatarLeftAndTopPos(e.pageX, e.pageY);
    
    this.element.style.left = leftPos - this.shiftX + "px";
    this.element.style.top = topPos - this.shiftY + "px";

    // the element under the dragging element. It could be any element
    const targetElement: any = getElementUnderClientXY(this.element, leftPos, topPos);

    // when we move the element outer of the dropzone area we won't have the targetEl
    if (!targetElement) return;

    // it should be only drag-element or spacer
    let dragTargetElement = null;


    this.highlightType = "top";


    // TODO: ---  I must refactor it ---

    // if we are over the spacer so there is no other DragElements and we should use it's index
    if (targetElement.classList.contains("drag-zone-spacer-bottom")) {
      this.currentPlaceIndex = +targetElement.dataset.index;
      
      
      dragTargetElement = targetElement;


    } else {
      const targetDragElement: any = findClosestParent(targetElement as HTMLElement, ".drag-element");
      // check if we are over a drag-element
      if (  targetDragElement ) {
        let targetDragElementIndex = +targetDragElement.dataset.index;
        
        const isOverAtTopOfDragElement = this.isAtTheTopPartOfTargetEl(targetElement, topPos);
        // Calculate the possible index to put our avatar. Index shouldn't be less than 0
        if (isOverAtTopOfDragElement) {
          this.currentPlaceIndex = targetDragElementIndex;
        } else {
          this.currentPlaceIndex = ++targetDragElementIndex;
          this.highlightType = "bottom";
        }
        // this.currentPlaceIndex = isAtTopOfTarget ? targetDragElementIndex : ++targetDragElementIndex;

        dragTargetElement = targetDragElement;
      } 
    }




    // if the target element wasn't saved before we need to handle it
    if ( dragTargetElement && this.currentTargetElement !== dragTargetElement ) {
     
      // save the previous target element. To let the dropzone to remove highlight from it as the element left this area
     this.prevTargetElement = this.currentTargetElement;

      // remember this new target element
      this.currentTargetElement = dragTargetElement
     
    }

    // this.highlightDropPosition(highlightType)

    
  }


  // detect if our cursor is over at the top half part of the current target element while dragging
  private isAtTheTopPartOfTargetEl(targetElement: any, pageY: number) {
    const targetElementCSSBox = targetElement.getBoundingClientRect();
    
    // it means the middle point of the target element from the page Top 
    const targetElementHalfLine = targetElementCSSBox.top + (targetElementCSSBox.height / 2);
    return pageY < targetElementHalfLine
  }

  // onDragEnd = () => {
  //   console.log("DRAG Avatar on Drag End");
  // }
  
}


