import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

@inject("appModel")
@observer
export default class AboutPage 
  extends React.Component<{appModel?: IAppModel}> {

  render() {
    return (
      <div>
        <h2>About</h2>
        <div>
          Combobox selected Item: <b>{this.props.appModel.selectedItem}</b>
        </div>
      </div>
    );
  }
}
