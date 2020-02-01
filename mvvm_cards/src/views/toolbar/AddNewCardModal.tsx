import * as React from "react";
import Modal from "shared/Modal";
import Card from "models/Card";

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";

const { useState, useRef } = React;

type Props = {
  appModel?: IAppModel;
  hide: () => void;
}

export function AddNewCardModal(props: Props) {
  const { hide, appModel } = props;
  const cardEntity = new Card();
  // a reference to our form that we'll submit manually from our modal
  const formRef = useRef(null);
  const [ card, setCard ] = useState(cardEntity);


  const generateOnChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard({
      ...card,
      [ fieldName ]: e.target.value
    })
  }

  return (
    <Modal 
      onDecline={hide} 
      onConfirm={() => {
        // [ ?. ] is optional chaining https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
        formRef?.current?.dispatchEvent(new Event("submit", { cancelable: true }));
      }}
    >
      <h3>New Card</h3>
      <form className="form" ref={formRef} onSubmit={e => {
          // prevent a page reloading
          e.preventDefault();

          // in general we could avoing the form submitting at all 
          // and do it in the modal onConfirm method
          // but I just wanted to show you how can you handle forms
          appModel.createNewCard(card);
          hide();
        }}>
        <div className="form-row">
          <label className="form-label" htmlFor="name">Name</label>
          <input className="form-field" 
            type="text"
            id="name"
            name="name"
            value={card.name}
            onChange={generateOnChange("name")}
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
            onChange={generateOnChange("description")}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Drawing</label>
          <span className="canvas" />
        </div>
      </form>
    </Modal>
  )
}

// one of the Mobx benefit is that we don't need to pass 
// the props throught a lot of parents (in our case we avoided 2 levels)
export default inject("appModel")(observer(AddNewCardModal))