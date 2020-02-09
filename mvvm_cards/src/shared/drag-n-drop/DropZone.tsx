import * as React from "react"
import cn from "classnames";

import { findClosestParent } from "shared/util";

// TODO: DI
import bus from "./services/bus";

// TODO: Move it to shared if useful
function isInDropZone(elementUnderMouse: any, dropZone: HTMLElement): any {
  if (!elementUnderMouse) { return false };
  const parentNode = elementUnderMouse.parentNode;
  return elementUnderMouse === dropZone ? true : isInDropZone(parentNode, dropZone);
}

type Props = {
  id: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;

  onDragEnd?: (data: any, placeIndex: number) => void;
}

export default class DropZone extends React.Component<Props> {

  rootElementRef: React.RefObject<HTMLDivElement> = React.createRef()


  // highlightedEl: any;

  onHover = () => {
    alert("On Hover")
  }

  componentDidMount() {
    const { onDragEnd, id } = this.props;
    if (!id) throw new Error("Every DropZone should have the ID prop");

    if (onDragEnd) {
      // TODO. used dropzone ID to set the subscriber to avoid memoryleak in future
      // bus.subscribeToDragEnd(id, onDragEnd);
      bus.subscribeToDragEnd(id, this.handleDragEnd);
    }
    
  }


  private highlightDropPosition = () => {
    const currentTargetElement = bus.data.avatar.getCurrentTargetElement()
    const prevTargetElement = bus.data.avatar.getPrevTargetElement()
 
    currentTargetElement.dataset.highlight = bus.data.avatar.highlightType;
    // this.highlightedEl = currentTargetElement;


    // console.log('1', isInDropZone(currentTargetElement, this.rootElementRef.current))
    // it could be null on the first dropzone-sector enter.
    // TODO. maybe move to pub/sub pattern via BUS?
    if (prevTargetElement) {
      // console.log("prevTargetElement => ", prevTargetElement)
      prevTargetElement.dataset.highlight = null;
    }
  }


  handleDragEnd = (data: any, placeIndex: number) => {
    const { onDragEnd } = this.props;


    // to allow CSS know about the active dragging process
    this.removeHighlight()
    // this.highlightedEl = null;
    document.documentElement.classList.remove("active-dragging")
    
    onDragEnd(data, placeIndex);
  }

  private removeHighlight = () => {
    
    const currentTargetElement = bus.data.avatar.getCurrentTargetElement()
    const prevTargetElement = bus.data.avatar.getPrevTargetElement()
    console.log("currentTargetElement => ", currentTargetElement)
    console.log("prevTargetElement => ", prevTargetElement)
    if (currentTargetElement) {
      console.log("ERASE")
      currentTargetElement.dataset.highlight = null;
    }

    if (prevTargetElement) {
      prevTargetElement.dataset.highlight = null;
    }
  }

  

  handleMouseMove = (e: any) => {
    if (!bus.data.avatar) return;

    this.highlightDropPosition()

    // const currentTargetElement = bus.data.avatar.getCurrentTargetElement()
    // const prevTargetElement = bus.data.avatar.getPrevTargetElement()

    // console.log("prevTargetElement => ", prevTargetElement)
    // console.log("currentTargetElement => ", currentTargetElement)

    // currentTargetElement.classList.add("dragging-over");
    // this.highlightedEl = currentTargetElement;


    // console.log('1', isInDropZone(currentTargetElement, this.rootElementRef.current))
    // it could be null on the first dropzone-sector enter.
    // TODO. maybe move to pub/sub pattern via BUS?
    // if (prevTargetElement) {
    //   // console.log("prevTargetElement => ", prevTargetElement)
    //   prevTargetElement.classList.remove("dragging-over");

      
    // }
   



    // console.log("Move ::::::::: e", bus.data.avatar.getTargetElement(), e, e.currentTarget, e.relativeTarget);
  }

  handleMouseLeave = () => {
    if (!bus.data.avatar) return;

    console.log("REMOVE highlight")

    // remove highlight on the dropZone leave
    this.removeHighlight()
  }

  render() {
    const { children, className, id } = this.props;

    // TODO: need to create some BUS between dnd components. Context would be best
    return (
      <div ref={this.rootElementRef} id={id} className={cn("drop-zone", className)} 
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        >
        {children}

      </div>
    )
  }

}