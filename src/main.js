import {getTripInfoComponent} from './components/trip-info';
import {getMenuComponent} from './components/menu';
import {getFiltersComponent} from './components/filters';
import {getSortComponents} from './components/sort';
import {getCardEditComponent} from './components/card-edit';
import {getCardBoardComponent} from './components/card-board';
import {getCardComponent} from './components/card';
import {getDayComponent, tripDaysData} from "./components/day-container";
import {menus, filters, sortedWaypoints} from './data';

const tripInfoContainer = document.querySelector(`.trip-info`);
const controlsContainer = document.querySelector(`.trip-controls`);
const mainContainer = document.querySelector(`.trip-events`);
const tripCostValue = document.querySelector(`.trip-info__cost-value`);
const renderQue = sortedWaypoints.slice();

/**
 * @param {Element} container
 * @param {string} markup
 * @param {InsertPosition} place
 */
const renderComponent = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
};

/**
 * @param { [ { offers: Set < {} >,
 *             city: string,
 *             description: string,
 *             time: {
 *               duration: {
 *                 days: string,
 *                 hours: string,
 *                 minutes: string
 *               },
 *               endTime: number,
 *               startTime: number
 *             },
 *             type: {
 *               address: string,
 *               template: string
 *             },
 *             waypointPrice: number,
 *             photos: [string] } ] } waypointList
 * @return {number}
 */
const getTripCostValue = (waypointList) => {
  let sum = 0;

  waypointList.forEach((it) => {
    sum += it.waypointPrice;
  });

  return sum;
};

tripCostValue.textContent = getTripCostValue(sortedWaypoints);
renderComponent(tripInfoContainer, getTripInfoComponent(), `afterbegin`);
renderComponent(controlsContainer, getMenuComponent(menus), `beforeend`);
renderComponent(controlsContainer, getFiltersComponent(filters), `beforeend`);
renderComponent(mainContainer, getSortComponents(), `beforeend`);
renderComponent(mainContainer, getCardBoardComponent(), `beforeend`);

const boardContainer = mainContainer.querySelector(`.trip-days`);

renderComponent(boardContainer, getDayComponent(), `beforeend`);

const eventsContainer = mainContainer.querySelectorAll(`.trip-events__list`);
let eventContainerIndex = 0;

for (let i = 0; i < tripDaysData.length; i++) {
  if (i > 0) {
    if (tripDaysData[i].tripDay !== tripDaysData[i - 1].tripDay) {
      eventContainerIndex++;
    }
  }

  renderComponent(eventsContainer[eventContainerIndex], getCardComponent(renderQue[0]), `beforeend`);
  renderQue.shift();
}

const cardEditBoardContainer = document.querySelector(`.trip-events__list`);

cardEditBoardContainer.firstElementChild.innerHTML = ``;
renderComponent(cardEditBoardContainer.firstElementChild, getCardEditComponent(sortedWaypoints[0]), `afterbegin`);
