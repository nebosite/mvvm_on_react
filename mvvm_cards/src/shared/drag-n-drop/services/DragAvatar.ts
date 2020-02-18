import { findClosestParent, getElementUnderClientXY } from "shared/util"

enum DragTargetType {
  spacer,
  dragElement,
}

type DragTargetResult = {
  type: DragTargetType;
  element: HTMLElement;
}

/** This service creates a drag avatar and contains logic regarding
 *  the dragged element (avatar) render and the DOM interacting
 *  such as position to place and highlight type
 */
export default class DragAvatar<T> {
  
  /** the drag element parent zone. */
  parentDragZone: HTMLElement

  /** Any kind of data that should be handled on drag end */
  data: T;

  /** the element that will be dragged.
   * In the simples solution it will be the same element that we clicked on
   *  But we can create some different avatar if needed as well and hide the original one
   */ 
  element: HTMLElement; 

  /** an element that under the mouse while we dragging the avatar (drag element) */
  currentTargetElement: HTMLElement
  prevTargetElement: HTMLElement


  /** a source element initial data regarding DOM positon */
  sourceElementData = {
    // a shift dimension from the left & top corners of the element and the mouse pointer clicked on the drag element
    shiftX: 0,
    shiftY: 0,

    // a shift dimension from the right & bottom corners of the element and the mouse pointer clicked on the drag element
    shiftXInversed: 0,
    shiftYInversed: 0,

    // the allowed values of the height and width. Based on the viewport data but we need
    // to know about the right | bottom shift values of the drag element + our viewPortModificator
    // our mouse pointer could be at the bottom of element so we need to know the width from the mouse till the
    // right side of the element to get the correct 'right end' side. The same in the Top case
    rightEnd: 0,
    bottomEnd: 0,
    leftEnd: 0,
    topEnd: 0,
  }
  /** a position in the cards list. Need to know it to put at the proper place */
  initialPlaceIndex: number;
  currentPlaceIndex: number;

  /** highlight type. Depends on where will be placed the drag element regarding the element
   * under the mouse. At top or at the bottom. Could be: top | bottom
   */
  highlightType: "top" | "bottom";

  constructor(parentDragZone: HTMLElement, dragElement: HTMLElement, e: MouseEvent, data: T) {
    this.parentDragZone = parentDragZone;
    this.data = data;

    // Saving the drag element index at list. Converting the data-attribute value from string to int.
    this.initialPlaceIndex = +dragElement.dataset.index;

    this.element = dragElement.cloneNode(true) as HTMLElement;

    this.initFromEvent(e, dragElement);
    this.calculateDragElementEnds();
  }

  /** a registry of the handlers for our allowed drag target types */
  dragTargetHandlers = {
    [ DragTargetType.spacer ]: this.handleSpacerAsDragTarget.bind(this),
    [ DragTargetType.dragElement ]: this.handleDragElementAsDragTarget.bind(this),
  }

  /** returns the parent drop zone of the drag element.
   * WARNING. In the case of thruly re-usable package the parent dropzone
   * should be optional as we might want to drag element fron non-dropzone element
   */
  getParentDropZone = () => findClosestParent(this.parentDragZone, ".drop-zone");

  /** calculatess the drag element (avatar) DOM coordinates and
   * places this element to DOM body without any visual state changes
  */
  initFromEvent(e: MouseEvent, originalElement: HTMLElement) {
    const elementCSSBox = originalElement.getBoundingClientRect();
    // need to know the mouse shift regarding the element coorditates
    // to give it the correct absolute coords after appending to the body el
    
    this.sourceElementData.shiftX = e.pageX - elementCSSBox.left;
    this.sourceElementData.shiftY = e.pageY - elementCSSBox.top;

    this.sourceElementData.shiftXInversed = ( elementCSSBox.left + elementCSSBox.width ) - e.pageX;
    this.sourceElementData.shiftYInversed = ( elementCSSBox.top + elementCSSBox.height ) - e.pageY;
    
    const elementPaddingValueStr = window.getComputedStyle(originalElement, null).getPropertyValue("padding")
    
    const elementTotalPadding = parseInt(elementPaddingValueStr) * 2;

    // would be nice if this class will be moved to constants with the API to change them
    // but I don't want to make things too complicated
    this.element.classList.add("dragging")
    this.element.style.position = "absolute"

    this.element.style.width = elementCSSBox.width - elementTotalPadding + "px"
    this.element.style.height = elementCSSBox.height - elementTotalPadding + "px"

    // moving it to the body to avoid unnecessary relative affect, etc.
    document.body.append(this.element);

    // set the render priority to maximum. The card shouldn't overlap by any element
    this.element.style.zIndex = "1000"
  }

  /** returns the current target element under the mouse while dragging */
  getCurrentTargetElement = () => this.currentTargetElement;

  /** returns the current previous element that was under the mouse while dragging */
  getPrevTargetElement = () => this.prevTargetElement;
  

  /** on the each drag move event it moves this.element and records
   * the current element below this.element to this.currentTargetElement
   */
  onDragMove = (e: MouseEvent) => {
    const [ leftPos, topPos ] = this.getAvatarLeftAndTopPos(e.pageX, e.pageY);
    
    // our mouse pointer could be at the middle of the element so it's necessary to calculate
    // the width between the left|top side and the cursor to know the correct values 
    // that includes this shift. We don't need some weird element 'jumpings'
    this.element.style.left = leftPos - this.sourceElementData.shiftX + "px";
    this.element.style.top = topPos - this.sourceElementData.shiftY + "px";

    // the element under the dragging element. It could be any element
    const elementUnderMouse = getElementUnderClientXY(this.element, leftPos, topPos);

    // when we move outside of the viewport we'll receive null. We shouldn't do anything in this case
    if (!elementUnderMouse) return;

    // by default the highlight type will be 'top' because by default we think that we are dragging
    // over the spacer. And the spacer is always the last one element so our drag element
    // will always be placed above of the spacer.
    this.highlightType = "top";

    const dragTargetResult = this.getElementUnderMouseType(elementUnderMouse);
    if (dragTargetResult === null) return;
   
    // some kind of overloading
    this.dragTargetHandlers[dragTargetResult.type](dragTargetResult.element, topPos);

    this.saveTargetsStack(dragTargetResult.element);
    
  }

  /**
   * saves the prev target element and current target element to know what element should
   * be highlighted and from what element the highlight should be removed
   * @param dragTarget - an element under the mouse while we dragging the drag element
   */
  private saveTargetsStack(dragTarget: HTMLElement) {
    // if the target element wasn't saved before so we need to handle it
    if ( this.currentTargetElement !== dragTarget ) {
     
      // save the previous target element. To let the dropzone to remove highlight from it 
      // as the drag avatar has left this area
     this.prevTargetElement = this.currentTargetElement;

      // remember this new target element
      this.currentTargetElement = dragTarget
    }
  }


  /** a handler  for the use case when under our mouse while dragging we have the spacer element */
  private handleSpacerAsDragTarget(dragTarget: HTMLElement) {
    this.currentPlaceIndex = +dragTarget.dataset.index;
  }

  /** a handler  for the use case when under our mouse while dragging we have the another drag element */
  private handleDragElementAsDragTarget(dragTarget: HTMLElement, topPos: number) {
    let targetDragElementIndex = +dragTarget.dataset.index;
        
    const isOverAtTopOfDragTarget = this.isAtTheTopPartOfTargetEl(dragTarget, topPos);

    // if we are at the top of the drag target so we will assign it's index to our drag element.
    // thus it will be placed at the dragTargetElement place (above of it)
    if (isOverAtTopOfDragTarget) {
      this.currentPlaceIndex = targetDragElementIndex;
    } else { // otherwise we need to place our dragElement below of the drag target
      this.currentPlaceIndex = ++targetDragElementIndex;
      this.highlightType = "bottom";
    }
  }
  
  /** returns the type of the element under mouse. Handles only allowed types or returns null */
  private getElementUnderMouseType(elementUnderMouse: HTMLElement): null | DragTargetResult {
    // if the element under mouse is drag-zone spacer we don't need to proceed anything more
    if (elementUnderMouse.classList.contains("drag-zone-spacer-bottom") ) {
      return {
        type: DragTargetType.spacer,
        element: elementUnderMouse
      };
    }

    // it isn't a spacer so let's try to find the drag-element in the element under mouse parent tree
    const targetDragElement = findClosestParent(elementUnderMouse, ".drag-element");
    if (targetDragElement) {
      return {
        type: DragTargetType.dragElement,
        element: targetDragElement as HTMLElement
      }
    }

    // the element under mouse neither a spacer or drag-element so will return a null value
    return null;
  }

  /** detect if our cursor is over at the top half part of the current target element while dragging */
  private isAtTheTopPartOfTargetEl(targetElement: HTMLElement, pageY: number) {
    const targetElementCSSBox = targetElement.getBoundingClientRect();
    
    // it means the middle point of the target element from the page Top 
    const targetElementHalfLine = targetElementCSSBox.top + (targetElementCSSBox.height / 2);
    return pageY < targetElementHalfLine
  }

  /** returns an array of the allowed left and top position of the drag avatar */
  private getAvatarLeftAndTopPos = (pageX: number, pageY: number): [number, number] => {

    const { leftEnd, topEnd, rightEnd, bottomEnd } = this.sourceElementData;

    // it's basically the preventing for the dragging the element outer of the
    //  Left and Top sides of the viewport.
    // if the mouse coordinates less than the element left | top 'ends' we'll just freeze
    // the element at it's left | top 'end'
    let left = pageX < leftEnd ? leftEnd : pageX;
    let top = pageY < topEnd ? topEnd: pageY;

    // we shouldn't move a card farest than the client right edge
    // if the left value is bigger than the viewPort width so we'll use this viewport width
    if ( left >= rightEnd ) { 
      left = rightEnd;
    }

    // we shouldn't move a card farest than the client top edge
    if ( top >= bottomEnd ) { 
      top = bottomEnd;
    }

    return [ left, top ];
  }

  /** calculates the drag element (avatar) allowed ends value of the dragging area in viewport
   * The element shouldn't cross out of any of these ends (depends on the dragging direction)
   */
  private calculateDragElementEnds() {
    // a pixel amount what will be used to stop the dragged avatar when it reach the viewporn ends
    const viewportEndCornerModificator = 10
    const { clientWidth, clientHeight } = document.documentElement;

    // the allowed values of the height and width. Based on the viewport data but we need
    // to know about the right | bottom shift values of the drag element + our viewPortModificator
    // our mouse pointer could be at the bottom of element so we need to know the width from the mouse till the
    // right side of the element to get the correct 'right end' side. The same in the Top case
    this.sourceElementData.rightEnd = clientWidth - this.sourceElementData.shiftXInversed + viewportEndCornerModificator;
    this.sourceElementData.bottomEnd = clientHeight - this.sourceElementData.shiftYInversed + viewportEndCornerModificator;

    this.sourceElementData.leftEnd =  this.sourceElementData.shiftX - viewportEndCornerModificator;
    this.sourceElementData.topEnd =  this.sourceElementData.shiftY - viewportEndCornerModificator;
  }

}
