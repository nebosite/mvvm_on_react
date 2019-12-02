import * as React from "react";

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

@inject("appModel")
@observer
export default class AboutPage 
  extends React.Component<{appModel?: IAppModel}> {

  render() {
    const { appModel } = this.props;

    return (
      <div className="about">
        <h2 className="page-title">About</h2>
        <div className="alert alert-primary query-row">
          <span>Combobox selected Item: </span>
          <b className="attention-msg">{appModel.selectedItem}</b>
        </div>
      </div>
    );
  }
}
