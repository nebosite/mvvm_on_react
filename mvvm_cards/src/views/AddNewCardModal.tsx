import * as React from "react";
import Modal from "shared/Modal";
import Card from "models/Card";

type Props = {
  showModal: boolean;
  hide: () => void;
}


export default function AddNewCardModal(props: Props) {
  const { showModal, hide } = props;
  const cardEntity = new Card();
  const [ card, setCard ] = React.useState(cardEntity)

  const generateOnChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard({
      ...card,
      [ fieldName ]: e.target.value
    })
  }

  return (
    <Modal 
      isShow={showModal} 
      onDecline={hide} 
      onConfirm={() => alert("CONFIRM")}
    >
      <h3>New Card</h3>
      <form className="form">
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