export function getElementCSSBox(element: HTMLElement) { 
  const box = element.getBoundingClientRect();
  return box;
}

export function findClosestParent(element: HTMLElement, cssSelector: string) {
  
  return element ? element.closest(cssSelector) : undefined;
}


export function getElementUnderClientXY(element: HTMLElement, clientX: number, clientY: number): HTMLElement {
  let display = element.style.display || '';
  element.style.display = "none";

  let target = document.elementFromPoint(clientX, clientY);

  element.style.display = display;

  return target as HTMLElement;
}
