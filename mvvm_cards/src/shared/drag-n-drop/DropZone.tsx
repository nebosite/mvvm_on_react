import * as React from "react"
import cn from "classnames";

// TODO: DI
import bus from "./services/bus";

import { findDroppable, getElementUnderClientXY } from "shared/util"

type Props = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

export default class DropZone extends React.Component<Props> {

  rootElementRef: React.RefObject<HTMLDivElement> = React.createRef()

  onHover = () => {
    alert("On Hover")
  }

  handleMouseMove = (e: any) => {
    if (!bus.data.avatar) return;

    const currentTargetElement = bus.data.avatar.getCurrentTargetElement()
    const prevTargetElement = bus.data.avatar.getPrevTargetElement()

    currentTargetElement.classList.add("drag-zone-sector-over");
    // it could be null on the first dropzone-sector enter
    if (prevTargetElement) {
      prevTargetElement.classList.remove("drag-zone-sector-over");
    }
   



    // console.log("Move ::::::::: e", bus.data.avatar.getTargetElement(), e, e.currentTarget, e.relativeTarget);
  }

  render() {
    const { children, className } = this.props;

    // TODO: need to create some BUS between dnd components. Context would be best
    return (
      <div ref={this.rootElementRef} className={cn("drop-zone", className)} 
        onMouseMove={this.handleMouseMove}
        >
          <section className="drop-zone-sector" style={{ height: "100px", display: "block", backgroundColor: "orange" }}>
            A
          </section>
          <section className="drop-zone-sector" style={{ height: "100px", display: "block", backgroundColor: "blue" }}>
            B
          </section>
          <section className="drop-zone-sector" style={{ height: "100px", display: "block", backgroundColor: "violet" }}>
            C
          </section>
         
      </div>
    )
  }

}