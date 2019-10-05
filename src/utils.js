import {getTargetMonth} from "./components/trip-info";

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

/**
 * @param { [ { offers: Set < {} >,
 *             city: string,
 *             description: string,
 *             time: {
 *               duration: {
 *                 days: number,
 *                 hours: number,
 *                 minutes: number
 *               },
 *               endTime: number,
 *               startTime: number
 *             },
 *             type: {
 *               address: string,
 *               template: string
 *             },
 *             waypointPrice: number,
 *             photos: [string] } ] } waypoints
 * @return { [ {
 *   tripDay: number,
 *   day: number,
 *   month: string,
 *   dayCode: number
 *        } ] }
 */
const getDaysData = (waypoints) => {
  let dates = [];

  if (waypoints.length) {
    let currentTripDay = 1;
    let oldStateDate = new Date(waypoints[0].time.startTime).getDate();
    let oldStateMonth = new Date(waypoints[0].time.startTime).getMonth();

    waypoints.forEach((it) => {
      if ((new Date(it.time.startTime).getDate() !== oldStateDate) || (new Date(it.time.startTime).getMonth() !== oldStateMonth)) {
        currentTripDay++;
      }

      dates.push({
        tripDay: currentTripDay,
        day: new Date(it.time.startTime).getDate(),
        month: getTargetMonth(new Date(it.time.startTime).getMonth()),
        dayCode: it.time.startTime
      });
      oldStateDate = new Date(it.time.startTime).getDate();
      oldStateMonth = new Date(it.time.startTime).getMonth();
    });
  }

  return dates;
};

const block = (btn) => {
  switch (btn) {
    case `Save`:
      document.querySelector(`.event__save-btn`).textContent = `Saving...`;
      break;

    case `Delete`:
      document.querySelector(`.event__reset-btn`).textContent = `Deleting...`;
      break;
  }
  document.querySelector(`.event__save-btn`).disabled = true;
  document.querySelector(`.event__reset-btn`).disabled = true;
  document.querySelector(`.event__rollup-btn`).disabled = true;
  document.querySelectorAll(`.event__offer-checkbox`).forEach((it) => {
    it.setAttribute(`disabled`, ``);
  });
  document.querySelector(`.event__input--destination`).setAttribute(`disabled`, ``);
  document.querySelectorAll(`.event__input--time`).forEach((it) => {
    it.setAttribute(`disabled`, ``);
  });
  document.querySelector(`.event__input--price`).setAttribute(`disabled`, ``);
  document.querySelector(`.event__type-toggle`).setAttribute(`disabled`, ``);
  document.querySelector(`.event__favorite-checkbox`).setAttribute(`disabled`, ``);
};

const addShacking = () => {
  document.querySelector(`.event--edit`).classList.add(`shake`);
  setTimeout(() => {
    document.querySelector(`.event--edit`).classList.remove(`shake`);
  }, 1000);
};

export {
  Position,
  getRandomNumber,
  createElement,
  renderComponent,
  unrenderComponent,
  getDaysData,
  block,
  addShacking
};
