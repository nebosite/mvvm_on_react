import * as React from "react"
import cn from "classnames";

// TODO: DI
import bus from "./services/bus";

type Props = {
  id: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;

  onDragEnd?: (data: any, placeIndex: number) => void;
}

export default class DropZone extends React.Component<Props> {

  rootElementRef: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidMount() {
    const { id } = this.props;
    if (!id) throw new Error("Every DropZone should have the ID prop");

    bus.subscribeToDragEnd(id, this.handleDragEnd);
    
  }

  private highlightDropPosition = () => {
    const currentTargetElement = bus.data.avatar.getCurrentTargetElement()
    const prevTargetElement = bus.data.avatar.getPrevTargetElement()
 
    // we have 2 different highlight types. Top and Bottom. Avatar provides it
    // it means, when our dragged element at the top of the element user our cursor
    // we will place our dragged element above of the target, or vice versa.
    currentTargetElement.dataset.highlight = bus.data.avatar.highlightType;

    // reset the previous element highlight when we highlight the new one
    if (prevTargetElement) {
      prevTargetElement.dataset.highlight = null;
    }
  }


  handleDragEnd = (data: any, placeIndex: number) => {
    const { onDragEnd } = this.props;
    // to allow CSS know about the active dragging process
    this.removeHighlight()
    // TODO: do some small interface for it. Mb move to bus?
    document.documentElement.classList.remove("active-dragging")
    
    if (typeof onDragEnd === 'function') {
      onDragEnd(data, placeIndex);
    }
    
  }

  handleMouseMove = (e: any) => {
    if (!bus.data.avatar) return;

    this.highlightDropPosition()
  }

  handleMouseLeave = () => {
    if (!bus.data.avatar) return;

    // remove highlight on the dropZone leave
    this.removeHighlight()
  }

  private removeHighlight = () => {
    const currentTargetElement = bus.data.avatar.getCurrentTargetElement()
    const prevTargetElement = bus.data.avatar.getPrevTargetElement()


    // it's possible to create a wrapper for it to make it in' one line. 
    // eg. pass 2 arg to the func and iterate the arg's array. But it will be resource expensive
    this.resetElementHighlight(currentTargetElement);
    this.resetElementHighlight(prevTargetElement);
  }

  // reset the highlight of the elements. Current and Prev.
  private resetElementHighlight(element: HTMLElement) {
    if (!element) return;
    element.dataset.highlight = null;
  }

  render() {
    const { children, className, id } = this.props;

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