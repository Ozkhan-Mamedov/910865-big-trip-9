import {getRouteInfoComponent} from './components/route-info';
import {getMenuComponent} from './components/menu';
import {getFiltersComponent} from './components/filters';
import {getSortComponents} from './components/sort';
import {getCardEditComponent} from './components/card-edit';
import {getCardBoardComponent} from './components/card-board';
import {getCardComponent} from './components/card';
import {getDayComponent} from "./components/day-container";
import {waypoints} from './data';

const tripInfoContainer = document.querySelector(`.trip-info`);
const controlsContainer = document.querySelector(`.trip-controls`);
const mainContainer = document.querySelector(`.trip-events`);
const renderQue = waypoints.slice();

/**
 * @param {Element} container
 * @param {string} markup
 * @param {InsertPosition} place
 */
const renderComponent = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
};

renderComponent(tripInfoContainer, getRouteInfoComponent(), `afterbegin`);
renderComponent(controlsContainer, getMenuComponent(), `beforeend`);
renderComponent(controlsContainer, getFiltersComponent(), `beforeend`);
renderComponent(mainContainer, getSortComponents(), `beforeend`);
renderComponent(mainContainer, getCardBoardComponent(), `beforeend`);

const CARD_NUMBER = 3;
const boardContainer = mainContainer.querySelector(`.trip-days`);
const DAYS_NUMBER = 3;

for (let i = 0; i < DAYS_NUMBER; i++) {
  renderComponent(boardContainer, getDayComponent(), `beforeend`);
}

const eventsContainer = mainContainer.querySelectorAll(`.trip-events__list`);

for (let i = 0; i < DAYS_NUMBER; i++) {
  for (let j = 0; j < CARD_NUMBER; j++) {
    renderComponent(eventsContainer[i], getCardComponent(renderQue[0]), `beforeend`);
    renderQue.shift();
  }
}

// for (let i = 0; i < CARD_NUMBER; i++) {
//   for (let j = 0; j < eventsContainer.length; j++) {
//     debugger
//     renderComponent(eventsContainer[j], getCardComponent(waypoints[i]), `beforeend`);
//   }
// }

const cardEditBoardContainer = document.querySelector(`.trip-events__list`);

cardEditBoardContainer.firstElementChild.innerHTML = ``;
renderComponent(cardEditBoardContainer.firstElementChild, getCardEditComponent(), `afterbegin`);
