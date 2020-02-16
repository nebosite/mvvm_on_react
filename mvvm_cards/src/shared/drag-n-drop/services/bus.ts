// a central d-n-d communication channel
// contains avatar data,  operates the drag end event trigger
// and share the necessary data between components
import { ICard } from "models/i_card";

import { DragEndSubscripersRegistryType, DragEndSubscriberType } from "../types"

import DragAvatar from "./DragAvatar";

class BUS<T> {
  avatar: DragAvatar<T> = null;

  // a very simple observer implementation. Supports only DragEnd
  dragEndSubcribersRegistry: DragEndSubscripersRegistryType<T> = {}

  reset = () => { 
    this.avatar.element.remove()
    this.avatar = null;
  }

  triggerDragEndByDropZoneId = (dropZoneId: string, placeIndex?: number | undefined) => {
    const dropZoneDragEndHandler = this.dragEndSubcribersRegistry[ dropZoneId ];
    if (!dropZoneDragEndHandler) {
      throw new Error(`There is not DropZone with such ID ${dropZoneId}`);
    }

    // TODO: maybe I need to refactor it and use this logic all the time?
    // if we can define the correct place index so there is no best option expect using the initial one
    if (placeIndex === undefined) {
      placeIndex = this.avatar.initialPlaceIndex;
    }
    
    dropZoneDragEndHandler(this.avatar.data, placeIndex);
  }

  subscribeToDragEnd = (dropZoneId: string, handler: DragEndSubscriberType<T>) => {
    // it's a very simple way to achieve this result. In the real app you need
    // to have a possibility to subscribe to different events by name
    // and a possibility to update the existing one instead of just replacing
    this.dragEndSubcribersRegistry[dropZoneId] = handler
  }
}

// it should be a singletone
export default new BUS();
