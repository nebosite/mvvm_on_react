export function getElementCSSBox(element: HTMLElement) { 
  const box = element.getBoundingClientRect();
  return box;
}

export function findDroppable(e: any) {

  // get an elment under the cursor postion
  // Warning. This mthod returns topmost element. So if we need to get deepest/tree of elements
  // I need to implement some utility with this functionality
  const elem = document.elementFromPoint(e.clientX, e.clientY);
  console.log("elem => ", elem);
  // try to find droppable zone

  console.log('closest', elem.closest(".dropzone--js"))
  return elem.closest(".dropzone--js");
}

export function getElementUnderClientXY(element: HTMLElement, clientX: number, clientY: number) {
  var display = element.style.display || '';
  element.style.display = "none";

  var target = document.elementFromPoint(clientX, clientY);

  element.style.display = display;

  return target;
}