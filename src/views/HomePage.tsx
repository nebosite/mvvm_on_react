import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";
import Combobox from "shared/Combobox";

// Performance Pattern:  For something that updates frequently, we want to 
// extract that into its own component to prevent re-rendering of the entire page
@inject("appModel")
@observer
class MouseBlock 
  extends React.Component<{appModel?: IAppModel}> {
    render()
    {
      const { appModel } = this.props;
      return (
        <div>
          Mouse Position: {appModel.someLocation.x}, {appModel.someLocation.y}
        </div>
      );    
    }
}

// Home page is just a simple page to display aspects of the app model
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
        <MouseBlock />

        <hr style={{ margin: "15px 0" }} />

        <h3>Text Input</h3> 
        Type in a new flavor: 
        <input className="flavor-input" type="text" value={ appModel.flavorInput }
          onChange={this.handleFlavorTextChange} />
        (<b>Length</b>: {appModel.flavorInput.length})<br />
        <button onClick={appModel.setUppercase} >Make Upper Case</button><br />
        <button onClick={appModel.setLowercase} >Make Lower Case</button><br />
        <button className="flavor-add-btn" onClick={appModel.addFlavor} disabled={!appModel.flavorTextIsValid} >Add</button>

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
          <b>Selected Item</b>: <span className="selected-flavor-box">{ appModel.selectedFlavor }</span><br/>
          <b>Item Count</b>: { appModel.flavors.length }<br/>

          <b>Items</b>: <br/>
          {/* just a quick solution. JSX keys should be unique ids */}
          {appModel.flavors.map(f => (<div key={f}>{f}</div>))}
          <p>Update the selected item via model method</p>
          <button onClick={appModel.chooseStrawberry}>Choose Strawberry</button>
      </div>
    );
  }
}
