// returns an element bounding rect. We might create a polyfill here.
export function getElementCSSBox(element: HTMLElement) { 
  const box = element.getBoundingClientRect();
  return box;
}

// returns a most closest parent of the passed element by selector or undefined
export function findClosestParent(element: HTMLElement, cssSelector: string) {
  return element ? element.closest(cssSelector) : undefined;
}

// returns an element under the mouse cursor. Could return undefined if it happens outside
// of the viewport
export function getElementUnderClientXY(element: HTMLElement, 
                                        clientX: number, clientY: number): HTMLElement | undefined {
  let display = element.style.display || '';
  element.style.display = "none";

  let target = document.elementFromPoint(clientX, clientY);

  element.style.display = display;

  return target as HTMLElement;
}
