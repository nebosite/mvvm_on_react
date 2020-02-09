// This service should create a drag avatar
import { findClosestParent, getElementUnderClientXY } from "shared/util"

export default class DragAvatar {
  
  // the element parent zone. 
  parentDragZone: HTMLElement

  // Data that should be handled on drag end
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


  sourceElementData = {
    // a shift dimension from the left & top corners of the element and the mouse pointer clicked on the drag element
    shiftX: 0,
    shiftY: 0,

    // a shift dimension from the right & bottom corners of the element and the mouse pointer clicked on the drag element
    shiftXInversed: 0,
    shiftYInversed: 0,
  }
  // a position in the cards list. Need to know it to put at the proper place
  initialPlaceIndex: number;
  currentPlaceIndex: number;

  // highlight type
  highlightType: string;

  // TODO: options
  constructor(parentDragZone: HTMLElement, dragElement: HTMLElement, e: any, data: any) {
    this.parentDragZone = parentDragZone;
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

    
    this.sourceElementData.shiftX = e.pageX - elementCSSBox.left;
    this.sourceElementData.shiftY = e.pageY - elementCSSBox.top;

    this.sourceElementData.shiftXInversed = ( elementCSSBox.left + elementCSSBox.width ) - e.pageX;
    this.sourceElementData.shiftYInversed = ( elementCSSBox.top + elementCSSBox.height ) - e.pageY;
    
    // TODO: maybe add padding/margin to dragElement ?
    const elementPaddingValueStr = window.getComputedStyle(this.originalElement, null).getPropertyValue("padding")
    
    const elementTotalPadding = parseInt(elementPaddingValueStr) * 2;

    // const totalElementMarginShift = dragElementTotalMargin + elementTotalPadding;
    
        // TODO: don't forget to do something with the margin

    this.element.classList.add("dragging")
    this.element.style.position = "absolute"


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

      // a pixel amount what will be used to stop the dragged avatar when it reach the viewporn ends
    const viewportEndCornerModificator = 10

    const documentClientW = document.documentElement.clientWidth - this.sourceElementData.shiftXInversed + viewportEndCornerModificator;
    const documentClientH = document.documentElement.clientHeight - this.sourceElementData.shiftYInversed + viewportEndCornerModificator;

    // console.log("this.shiftX", this.shiftX)
    // console.log("this.shiftY", this.shiftY)

    // console.log("L, R", this.shiftXInversed, this.shiftYInversed );

    // we shouldn't move a card at the left|top document edges
    let left = pageX < this.sourceElementData.shiftX - viewportEndCornerModificator ? this.sourceElementData.shiftX - viewportEndCornerModificator : pageX;
    let top = pageY < this.sourceElementData.shiftY - viewportEndCornerModificator ? this.sourceElementData.shiftY - viewportEndCornerModificator: pageY;

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
    
    this.element.style.left = leftPos - this.sourceElementData.shiftX + "px";
    this.element.style.top = topPos - this.sourceElementData.shiftY + "px";

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


