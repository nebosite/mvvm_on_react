import * as React from "react";
import MainDialog from "shared/ModalDialog";
import Card from "models/Card";

import { observer, inject } from "mobx-react";

type Props = {
  addCard: (card: Card) => void;
  hide: () => void;
}

type State = {
  card: Card;
}

export class AddNewCardModal extends React.Component<Props, State> {

  state = {
    card: new Card()
  }

  formRef: React.RefObject<HTMLFormElement> = React.createRef()

  generateOnChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCard = {
      ...this.state.card,
      [ fieldName ]: e.target.value
    }
    this.setState({
      card: updatedCard
    })
  }

  render() {
    const { hide, addCard } = this.props;
    const { card } = this.state;

    return (
      <MainDialog 
        onDecline={hide} 
        onConfirm={() => {
          // [ ?. ] is optional chaining https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
          this.formRef?.current?.dispatchEvent(new Event("submit", { cancelable: true }));
        }}
      >
        <h3>New Card</h3>
        <form className="form" ref={this.formRef} onSubmit={e => {
            // prevent a page reloading
            e.preventDefault();

            // in general we could avoing the form submitting at all 
            // and do it in the modal onConfirm method
            // but I just wanted to show you how can you handle forms
            addCard(card);
            hide();
          }}>
          <div className="form-row">
            <label className="form-label" htmlFor="name">Name</label>
            <input className="form-field" 
              type="text"
              id="name"
              name="name"
              value={card.name}
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
              value={card.description}
              onChange={this.generateOnChange("description")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Drawing</label>
            <span className="canvas" />
          </div>
        </form>
      </MainDialog>
    )
  }
}

// one of the Mobx benefit is that we don't need to pass 
// the props throught a lot of parents (in our case we avoided 2 levels)
export default inject("appModel")(observer(AddNewCardModal))