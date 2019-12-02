import * as React from "react";

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

type Props = {
 appModel?: IAppModel
};

function About(props: Props) {
  const appModel = props.appModel;

  return (
    <div className="about">
      <h2 className="page-title">About</h2>
      <div className="alert alert-primary query-row">
        <span>Combobox selected Item: </span>
        <b className="attention-msg">Here should be a selected checkbox item value</b>
      </div>
    </div>
  );
}

export default inject("appModel")(observer(About));
