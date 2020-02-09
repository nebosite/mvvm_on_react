import * as React from "react";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  
  // a position index in the element list. Necessary to know where to put it at drag end
  index: number;

  // a data that should be handler on drag end
  data: any;
}


export default class DragElement extends React.Component<Props> {
  handleMouseDown = (e: React.MouseEvent) => {
    // make this event to be persistent for the DragZone
    // without it React will do a snapshot of event and warn you about re-use
    e.persist();

    const element = e.currentTarget;

    // TODO: should I add the inner children instante to it as well ?
    (e as any).data = {
      element: element,
      data: this.props.data
    }
  }

  render() {
    const { children, index } = this.props;

    return (
      <div className="drag-element"
          data-index={index}
          onMouseDown={this.handleMouseDown}
        >
        { children }
      </div>
    )
  }
}