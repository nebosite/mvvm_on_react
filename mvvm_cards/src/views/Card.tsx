import * as React from "react";
import { ICard } from "models/i_card";

export default function Card(card: ICard) {
  return (
    <figure className="card">
      <b>Name</b>: { card.name }
      <br />
      <b>Description</b>: { card.description }
    </figure>
  )
}