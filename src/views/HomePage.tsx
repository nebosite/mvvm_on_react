import * as React from "react";

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";
import Combobox from "shared/components/Combobox";

@inject("appModel")
@observer
export default class Home 
  extends React.Component<{appModel?: IAppModel}> {

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.appModel.textInput = e.target.value;
  }

  render() {
    const { appModel } = this.props;

    return (
      <div className="home">
        <h2>Home Page</h2>
        <h3>Mouse Position: 
          {appModel.mousePosition.x}, 
          {appModel.mousePosition.y}</h3>

        <hr style={{ margin: "15px 0" }} />

        <h3>Text Input Length tracking</h3>
        <input type="text" value={ appModel.textInput }
          onChange={this.handleInputChange}  />
        <b>Length</b>: {appModel.textInput.length}<br />
        <button onClick={appModel.setUppercase} >Make Upper Case</button>
        <button onClick={appModel.setLowercase} >Make Lower Case</button>

        <hr style={{ margin: "15px 0" }} />

        <h3>Combobox</h3>
          <Combobox
            itemsSource={appModel.flavors}
            selectedItem={appModel.selectedItem}
            onSelectValue={item => {
              appModel.selectedItem = item;
            }}
          /><br />
          <b>Selected Item</b>: { appModel.selectedItem }
      </div>
    );
  }
}
