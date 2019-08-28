const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

/**
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @param {string} template
 * @return {ChildNode}
 */
const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;

  return newElement;
};

/**
 * @param {Element} container
 * @param {Node} element
 * @param {InsertPosition} place
 */
const renderComponent = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;

    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

/**
 * @param {Element} element
 */
const unrenderComponent = (element) => {
  if (element) {
    element.remove();
  }
};

export {
  getRandomNumber,
  createElement,
  renderComponent,
  unrenderComponent
};
