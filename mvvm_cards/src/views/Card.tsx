import * as React from "react";
import { ICard } from "models/i_card";
export default function Card(card: ICard) {

  // TODO: maybe add Card data to the mouseDown event?

  function handleDragStart(e: React.DragEvent) {
    e.preventDefault()
  }

  return (
    <figure className="card"
      draggable={true}
      onDragStart={handleDragStart}
      >
      <b>Name</b>: { card.name }
      <br />
      <b>Description</b>: { card.description }
    </figure>
  )
}