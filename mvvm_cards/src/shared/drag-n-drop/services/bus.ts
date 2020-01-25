// Just a try to see if it make our life easier

class BUS {
  data = this.getInitialData();

  reset = () => this.data = this.getInitialData();

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