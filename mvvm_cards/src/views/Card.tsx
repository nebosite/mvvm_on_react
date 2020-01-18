import * as React from "react";
import { ICard } from "models/i_card";

export default class Card extends React.Component<ICard> {
  
  render() {
    const { name, description } = this.props;
    return (
      <figure className="card">
        <b>Name</b>: { name }
        <br />
        <b>Description</b>: { description }
      </figure>
    )
  }

}