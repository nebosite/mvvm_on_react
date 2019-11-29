import * as React from "react";
import { observer, inject } from "mobx-react";

import { StoresEnum } from "stores";

type Props = {
  mousePositionStore?: I_MousePositionStore;
};

@inject(StoresEnum.mousePositionStore)
@observer
export default class MousePositionView extends React.Component<Props> {
  render() {
    const { position } = this.props.mousePositionStore;
    return (
      <div className="col-6">
        <div className="st-container">
          <h5>Mouse position</h5>
          Mouse position:{" "}
          <b className="attention-msg">
            {position.x} : {position.y}
          </b>
        </div>
      </div>
    );
  }
}
