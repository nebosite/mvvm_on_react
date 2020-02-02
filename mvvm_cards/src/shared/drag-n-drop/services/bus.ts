// Just a try to see if it make our life easier

class BUS {
  data = this.getInitialData();

  dragEndSubcribersRegistry: any = {
    // // implement a subscriber ID to avoid memory leak
    // "documentMouseUp": []
  }

  reset = () => this.data = this.getInitialData();

  triggerDragEndByDropZoneId = (dropZoneId: string, placeIndex?: number | undefined) => {
    const dropZoneDragEndHandler = this.dragEndSubcribersRegistry[ dropZoneId ];
    if (!dropZoneDragEndHandler) {
      throw new Error(`There is not DropZone with such ID ${dropZoneId}`);
    }

    console.log("1111 placeIndex", placeIndex)
    // TODO: maybe I need to refactor it and use this logic all the time?
    // if we can define the correct place index so there is no best option expect using the initial one
    if (placeIndex === undefined) {
      placeIndex = this.data.avatar.initialPlaceIndex;
    }
    
    console.log("2222 placeIndex", placeIndex)
    dropZoneDragEndHandler(this.data.avatar.data, placeIndex);
  }

  subscribeToDragEnd = (dropZoneId: string, handler: (dragElementData: any, index: number) => void) => {
    // it's a very simple way to achieve this result. In the real app you need
    // to have a possibility to subscribe to different events by name
    // and a possibility to update the existing one instead of just replacing
    this.dragEndSubcribersRegistry[dropZoneId] = handler
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