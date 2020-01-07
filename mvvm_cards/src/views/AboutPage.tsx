import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

// -------------------------------------------------------------------
// The about page is simply an extra page that is also bound to
// the appModel.  Any change in the appModel made on another page
// will automatically update this page.
// -------------------------------------------------------------------

@inject("appModel")
@observer
export default class AboutPage 
  extends React.Component<{appModel?: IAppModel}> {

  render() {
    return (
      <div>
        <h2>About Page</h2>
      </div>
    );
  }
}
