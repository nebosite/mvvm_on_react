import * as React from "react"
import cn from "classnames";

// TODO: DI
import bus from "./services/bus";

import { findDroppable, getElementUnderClientXY } from "shared/util"

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

  onDragEnd?: (data: any) => void;
}

export default class DropZone extends React.Component<Props> {

  rootElementRef: React.RefObject<HTMLDivElement> = React.createRef()


  highlightedEl: any;

  onHover = () => {
    alert("On Hover")
  }

  componentDidMount() {
    const { onDragEnd, id } = this.props;
    if (!id) throw new Error("Every DropZone should have the ID prop");

    if (onDragEnd) {
      // TODO. used dropzone ID to set the subscriber to avoid memoryleak in future
      bus.subscribeToDragEnd(id, onDragEnd);
    }
    
  }

  handleMouseMove = (e: any) => {
    if (!bus.data.avatar) return;

    const currentTargetElement = bus.data.avatar.getCurrentTargetElement()
    const prevTargetElement = bus.data.avatar.getPrevTargetElement()

    currentTargetElement.classList.add("drag-zone-sector-over");
    this.highlightedEl = currentTargetElement;


    // console.log('1', isInDropZone(currentTargetElement, this.rootElementRef.current))
    // it could be null on the first dropzone-sector enter
    if (prevTargetElement) {
      // console.log("prevTargetElement => ", prevTargetElement)
      prevTargetElement.classList.remove("drag-zone-sector-over");

      
    }
   



    // console.log("Move ::::::::: e", bus.data.avatar.getTargetElement(), e, e.currentTarget, e.relativeTarget);
  }

  handleMouseLeave = () => {
    if (!this.highlightedEl) return;

    // remove highlight on the dropZone leave
    this.highlightedEl.classList.remove("drag-zone-sector-over");
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