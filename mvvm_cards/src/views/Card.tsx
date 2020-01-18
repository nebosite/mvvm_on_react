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

  const rootElRef = React.useRef(null);

  function handleCardMouseDown(e: any) {
    const cardElement = rootElRef.current;

    var box = getElementCSSBox(cardElement);
    var shiftX = e.pageX - box.left;
    var shiftY = e.pageY - box.top;
    console.log("e.pageX", e.pageX)
    console.log("e.pageY", e.pageY)

     // ------ will need it in future -----
      // remember element
      dragObject.elem = cardElement;

      // remember initial coords 
      dragObject.downX = e.pageX;
      dragObject.downY = e.pageY;

      // ! ------ will need it in future -----
      


    const cardPaddingValueStr = window.getComputedStyle(cardElement, null).getPropertyValue("padding")
    const cardTotalPadding = parseInt(cardPaddingValueStr) * 2;
    
    // preparing the card to be moved
    
    // TODO: don't forget to do something with the margin

    cardElement.classList.add("dragging")
    cardElement.style.position = "absolute"
    cardElement.style.width = box.width - cardTotalPadding + "px"
    cardElement.style.height = box.height - cardTotalPadding + "px"

    // moving it to the body to avoid unnecessary relative affect, etc.
    document.body.append(cardElement)

    // set the render priority to maximum. The card shouldn't overlap by any element
    cardElement.style.zIndex = 1000

    function moveAt(e: any) {
      cardElement.style.left = e.pageX - shiftX + "px";
      cardElement.style.top = e.pageY - shiftY + "px";
    }

    moveAt(e);

    document.onmousemove = function mouseMoveCallback(e: any) {
      moveAt(e)
    };

    function finishDrag(e: any) {
     const dropElem = findDroppable(e);
    
      if (dropElem) {
        // just a quick DEMO that this proof of concept works
        dropElem.appendChild(cardElement)
        cardElement.style.position = "static"

        
      } else {
        // alert("Doesn't found droppable area")
      }

      
    }

    // reset all handlers
    document.onmouseup = function(e: any) {
      // e.persist()

      // current drag event
      if (dragObject.elem) {
        finishDrag(e);
      }

      // reset object
      dragObject = {};

      document.onmousemove = null;
      document.onmouseup = null
      cardElement.classList.remove("dragging")
      
    }

    
  }

  function handleDragStart(e: any) {
    // don't need to create a default browser ghost node
    
    e.preventDefault()

  //   const clone = e.target.cloneNode(true);


  //   let x = 0;
  //   let y = 0;

  //   document.body.appendChild(clone);
  //   e.dataTransfer.setData('text/plain', JSON.stringify(card));

  //   document.addEventListener("mousemove", function dragStartCallback(ev: any){
  //     var ev = ev || window.event;
  //     var dragX = ev.pageX, dragY = ev.pageY;
  
  //     console.log("X: "+dragX+" Y: "+dragY);
  //     x = dragX;
  //     y = dragY;
      
  //     clone.style = `transition: none; position: absolute; top: ${y}px; left: ${x}px`;

  //     document.addEventListener("mouseup", function mouseUpCallback() {

  //       document.removeEventListener("mousemove", dragStartCallback);
  //       document.removeEventListener("mouseup", mouseUpCallback);
  //     }) 


  // }, false);

  

  

  //   e.currentTarget.style
  //   .backgroundColor = 'yellow';
    // e.dataTransfer.setDragImage(clone, 10, 10);
  }

  return (
    <div className="card-wrapper">
      <figure ref={rootElRef} className="card"
        draggable={true}
        onMouseDown={handleCardMouseDown}
        onDragStart={handleDragStart}
        >
        <b>Name</b>: { card.name }
        <br />
        <b>Description</b>: { card.description }
      </figure>
    </div>

  )
}