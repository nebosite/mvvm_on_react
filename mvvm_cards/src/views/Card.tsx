import * as React from "react";
import { ICard } from "models/i_card";


export default function Card(card: ICard) {

  const rootElRef = React.useRef(null);

  function handleDragStart(e: any) {
    console.log("e =>> ", e);
    const clone = e.target.cloneNode(true);

    let x = 0;
    let y = 0;

    document.body.appendChild(clone);

    document.addEventListener("dragover", function(ev: any){
      var ev = ev || window.event;
      var dragX = ev.pageX, dragY = ev.pageY;
  
      console.log("X: "+dragX+" Y: "+dragY);
      x = dragX;
      y = dragY;
      
      clone.style = `transition: none; position: absolute; top: ${y}px; left: ${x}px`;

  }, false);

  
  

    e.currentTarget.style
    .backgroundColor = 'yellow';
    // e.dataTransfer.setDragImage(clone, 10, 10);
  }

  return (
    <figure ref={rootElRef} className="card" draggable={true} onDragStart={handleDragStart}>
      <b>Name</b>: { card.name }
      <br />
      <b>Description</b>: { card.description }
    </figure>
  )
}