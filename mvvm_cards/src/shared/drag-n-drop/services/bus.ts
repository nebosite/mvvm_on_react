
type DragElementMouseDownEvent = React.MouseEvent & {
  data: {
    element: HTMLElement;
    data: any; // a data of the drag element
  }
}

class BUS {
  data = this.getInitialData();

  
  mouseData = {
    pageX: 0,
    pageY: 0
  }


  // TODO. Do we really need it here?
  dragObject: {
    element: HTMLElement,
    data: any
  } = null;

  setDragObject(element: any, data: any) {
    this.dragObject = {
      element,
      data
    }
  }

  sourceElementData = {
    // a shift dimension from the left & top corners of the element and the mouse pointer clicked on the drag element
    shiftX: 0,
    shiftY: 0,

    // a shift dimension from the right & bottom corners of the element and the mouse pointer clicked on the drag element
    shiftXInversed: 0,
    shiftYInversed: 0,
  }


  dragEndSubcribersRegistry: any = {
    // // implement a subscriber ID to avoid memory leak
    // "documentMouseUp": []
  }

  reset = () => { 
    this.dragObject.element.classList.remove("dragging")
    this.dragObject = null;

    // TODO: maybe just use the drag object? why do we need this drag object here?
    this.data.avatar.element.remove()
    this.data.avatar = null;

    this.data = this.getInitialData();
  }

  triggerDragEndByDropZoneId = (dropZoneId: string, placeIndex?: number | undefined) => {
    const dropZoneDragEndHandler = this.dragEndSubcribersRegistry[ dropZoneId ];
    if (!dropZoneDragEndHandler) {
      throw new Error(`There is not DropZone with such ID ${dropZoneId}`);
    }

    // TODO: maybe I need to refactor it and use this logic all the time?
    // if we can define the correct place index so there is no best option expect using the initial one
    if (placeIndex === undefined) {
      placeIndex = this.data.avatar.initialPlaceIndex;
    }
    
    dropZoneDragEndHandler(this.data.avatar.data, placeIndex);
  }

  subscribeToDragEnd = (dropZoneId: string, handler: (dragElementData: any, index: number) => void) => {
    // it's a very simple way to achieve this result. In the real app you need
    // to have a possibility to subscribe to different events by name
    // and a possibility to update the existing one instead of just replacing
    this.dragEndSubcribersRegistry[dropZoneId] = handler
  }


  extractMouseCoordsFromEvent(e: DragElementMouseDownEvent | React.MouseEvent<HTMLElement>) {
    this.mouseData.pageX = e.pageX;
    this.mouseData.pageY = e.pageY;
  }

  private getInitialData(): any {
    return {
      avatar: null,
    
      // downX: null,
      // downY: null,
    
      // shiftX: null,
      // shiftY: null,
    
      currentDropZoneElement: null,
    }
  }
}

export default new BUS();