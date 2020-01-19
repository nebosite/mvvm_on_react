import * as React from "react";
import { ICard } from "models/i_card";

function getElementCSSBox(element: HTMLElement) { 
  const box = element.getBoundingClientRect();
  console.log("box", box);
  console.log("box.top", box.top);
  console.log("box.left", box.left);
  console.log("window.pageYOffset", window.pageYOffset)
  console.log("window.pageXOffset", window.pageXOffset)

  return box;

}

// TODO: move all handling from the CARD to top. Must use Bubbling !

// Temporary
let dragObject: any = {};

function findDroppable(e: any) {

  // get an elment under the cursor postion
  // Warning. This mthod returns topmost element. So if we need to get deepest/tree of elements
  // I need to implement some utility with this functionality
  const elem = document.elementFromPoint(e.clientX, e.clientY);
  console.log("elem => ", elem);
  // try to find droppable zone

  console.log('closest', elem.closest(".dropzone--js"))
  return elem.closest(".dropzone--js");
}

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