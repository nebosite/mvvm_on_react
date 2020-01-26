// Just a try to see if it make our life easier

class BUS {
  data = this.getInitialData();

  eventSubscribers: any = {
    // implement a subscriber ID to avoid memory leak
    "documentMouseUp": []
  }

  reset = () => this.data = this.getInitialData();

  triggerDragEnd = () => {
    if (this.eventSubscribers.length === 0) return;
    
    this.eventSubscribers.documentMouseUp.forEach((fn: any) => fn(this.data.avatar.data))
    console.log("trigger drag end");

  }

  subscribeToDragEnd = (handler: (dragElementData: any) => void) => {
    const handlersArrayLn = this.eventSubscribers.documentMouseUp.push(handler);
    return handlersArrayLn - 1;
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