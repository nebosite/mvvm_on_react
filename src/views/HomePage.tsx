import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";
import Combobox from "shared/Combobox";

@inject("appModel")
@observer
export default class Home 
  extends React.Component<{appModel?: IAppModel}> {

  handleFlavorTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.appModel.flavorInput = e.target.value;
  }

  render() {
    const { appModel } = this.props;

    return (
      <div className="home">
        <h2>Home Page</h2>
        Here are some examples of hooking page elements to a view model:
        <hr style={{ margin: "15px 0" }} />

        <h3>Dynamic pointer input:</h3> 
        Mouse Position: {appModel.someLocation.x}, {appModel.someLocation.y}

        <hr style={{ margin: "15px 0" }} />

        <h3>Text Input</h3> 
        Type in a new flavor: 
        <input type="text" value={ appModel.flavorInput }
          onChange={this.handleFlavorTextChange} />
        (<b>Length</b>: {appModel.flavorInput.length})<br />
        <button onClick={appModel.setUppercase} >Make Upper Case</button><br />
        <button onClick={appModel.setLowercase} >Make Lower Case</button><br />
        <button onClick={appModel.addFlavor
           /* TODO: link the style to the app model so that this 
           button is disabled if there is no text in the input */} >Add</button>

        <hr style={{ margin: "15px 0" }} />

        <h3>Combobox</h3>
           Select a flavor: 
          <Combobox
            itemsSource={appModel.flavors}
            selectedItem={appModel.selectedFlavor}
            onSelectValue={item => {
              appModel.selectedFlavor = item;
            }}
          /><br />
          <b>Selected Item</b>: { appModel.selectedFlavor }<br/>
          <b>Item Count</b>: { appModel.flavors.length }<br/>
          <p>Update the selected item via model method</p>
          <button onClick={appModel.chooseStrawberry}>Choose Strawberry</button>
      </div>
    );
  }
}
