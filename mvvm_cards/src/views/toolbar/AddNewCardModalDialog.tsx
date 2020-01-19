import * as React from "react";
import ModalDialog from "shared/ModalDialog";
import Card from "models/Card";

import { observer, inject } from "mobx-react";

type Props = {
  showDialog: boolean;

  addCard: (card: Card) => void;
  hide: () => void;
}

type State = {
  card: Card;
}

export class AddNewCardModalDialog extends React.Component<Props, State> {

  state = {
    card: new Card()
  }

  formRef: React.RefObject<HTMLFormElement> = React.createRef()

  // as we use Classes so we can use lifecyclehook to manipulate our state based on props
  static getDerivedStateFromProps(props: Readonly<Props>, state: State) {
    // if we show modal and the state card is empty (the first Modal show)
    if (props.showDialog && !state.card) {
      return {
        card: new Card()
      }
    }
    return null;
  }


  generateOnChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCard = {
      ...this.state.card,
      [ fieldName ]: e.target.value
    }
    this.setState({
      card: updatedCard
    })
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // prevent a page reloading
    e.preventDefault();

    // in general we could avoing the form submitting at all 
    // and do it in the modal onConfirm method
    // but I just wanted to show you how can you handle forms
    this.props.addCard(this.state.card);
    this.props.hide();
    // let's reset the Card state on Hide
    this.setState({
      card: null
    });
  }

  getContent() {

    return !this.props.showDialog ? null : (
      <>
        <h3>New Card</h3>
          <form className="form" ref={this.formRef} onSubmit={this.handleSubmit}>
            <div className="form-row">
              <label className="form-label" htmlFor="name">Name</label>
              <input className="form-field" 
                type="text"
                id="name"
                name="name"
                value={this.state.card.name}
                onChange={this.generateOnChange("name")}
              />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="description">Description</label>
              <input 
                className="form-field"
                type="text"
                id="description" 
                name="description"
                value={this.state.card.description}
                onChange={this.generateOnChange("description")}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Drawing</label>
              <span className="canvas" />
            </div>
          </form>
        </>
    )
  }

  render() {
    return (
      <ModalDialog
        onDecline={this.props.hide} 
        onConfirm={() => {
          // [ ?. ] is optional chaining https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
          this.formRef?.current?.dispatchEvent(new Event("submit", { cancelable: true }));
        }}
      >
        { this.getContent() }
      </ModalDialog>
    )
  }
}

// one of the Mobx benefit is that we don't need to pass 
// the props throught a lot of parents (in our case we avoided 2 levels)
export default inject("appModel")(observer(AddNewCardModalDialog))