import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";
import Combobox from "shared/Combobox";

// -------------------------------------------------------------------
// The home page is the main page of this demo application.  There
// are multiple example of controls here that are bound to data in
// the application model
// -------------------------------------------------------------------

// ** Performance Pattern **:  In this demo, the mouse input updates frequently,
// but we don't want to have to redraw the ENTIRE PAGE for just a small data
// change.  To fix this, we want to extract the little part we do want updated
// into its own component.  This keeps re-rendering isolation to just the
// little component.
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

// -------------------------------------------------------------------
// The home page Component
//
// The page is bound to an IAppModel object, which is passed in as
// a prop.  Binding is achieved simply by referencing this.props in the
// render() function.
// -------------------------------------------------------------------

// @inject decorator is needed for automatic dependency injection- see the Provider
// element in index.tsx
@inject("appModel") 

// @observer decorator is needed to recieve updates when the underlying model changes
@observer
export default class Home 
  extends React.Component<{appModel?: IAppModel}> {

  // -------------------------------------------------------------------
  // This is how we take an action on the input component and
  // communicate it back to the model
  // -------------------------------------------------------------------
  handleFlavorTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.appModel.flavorInput = e.target.value;
  }

  // -------------------------------------------------------------------
  // Here we take mouse input and turn it into some location.  In a 
  // real app, there would likely be some addition logic to translate
  // the mouse location to an location in units the app understands.  This
  // logic should NOT be here, but rather in a value converter class
  // that can be easily tested outside of the UI.
  // -------------------------------------------------------------------
  handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.appModel.someLocation.x = event.pageX;
    this.props.appModel.someLocation.y = event.pageY;
  };

  // -------------------------------------------------------------------
  // Generate the visuals.  Binding happens here by referncing this.props
  // -------------------------------------------------------------------
  render() {
    const { appModel } = this.props; // convenient handle to appModel

    return (
      <div className="home"  onMouseMove={ this.handleMouseMove }>
        <h2>Home Page</h2>
          Here are some examples of hooking page elements to a view model:

        <hr style={{ margin: "15px 0" }} />

        <h3>Dynamic pointer input:</h3> 
        <MouseBlock /> 

        <hr style={{ margin: "15px 0" }} />

        <h3>Text Input</h3> 
        Type in a new flavor: 
        <input 
          className="flavor-input" 
          type="text" 
          value={ appModel.flavorInput }
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
