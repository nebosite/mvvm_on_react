export type DragEndSubscriberType<T> = (dragElementData: T, index: number) => void;

export type DragEndSubscripersRegistryType<T> = {
  [dragZoneId: string]: DragEndSubscriberType<T>;
}

export type DragObjectDataType<T> = {
  element: HTMLElement;
  data: T;
  // initial dragObject pageX and pageY
  initialPageX: number,
  initialPageY: number
} | null;


export type DragElementMouseDownEventType<T> = React.MouseEvent & {
  data: {
    element: HTMLElement;
    data: T; // a data of the drag element
  }
}