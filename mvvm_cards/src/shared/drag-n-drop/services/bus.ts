// Just a try to see if it make our life easier

class BUS {
  data = this.getInitialData();

  dragEndSubcribersRegistry: any = {
    // // implement a subscriber ID to avoid memory leak
    // "documentMouseUp": []
  }

  reset = () => this.data = this.getInitialData();

  triggerDragEndByDropZoneId = (dropZoneId: string) => {
    console.log("dropZoneId => ", dropZoneId);
    console.log("this.dragEndSubcribersRegistry => ", this.dragEndSubcribersRegistry);
    const dropZoneDragEndHandler = this.dragEndSubcribersRegistry[ dropZoneId ];
    if (!dropZoneDragEndHandler) {
      throw new Error(`There is not DropZone with such ID ${dropZoneId}`);
    }

    dropZoneDragEndHandler(this.data.avatar.data);
    console.log("trigger drag end");

  }

  subscribeToDragEnd = (dropZoneId: string, handler: (dragElementData: any) => void) => {
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