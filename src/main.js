import {getRouteInfoComponent} from './components/route-info.js';
import {getMenuComponent} from './components/menu.js';
import {getFiltersComponent} from './components/filters.js';
import {getSortComponents} from './components/sort.js';
import {getCardEditComponent} from './components/card-edit.js';
import {getCardBoardComponent} from './components/card-board.js';
import {getCardComponent} from './components/card.js';

const tripInfoContainer = document.querySelector(`.trip-info`);
const controlsContainer = document.querySelector(`.trip-controls`);
const mainContainer = document.querySelector(`.trip-events`);

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
renderComponent(mainContainer, getCardEditComponent(), `beforeend`);
renderComponent(mainContainer, getCardBoardComponent(), `beforeend`);

const CARD_NUMBER = 3;
const boardContainer = mainContainer.querySelector(`.trip-days`);

for (let i = 0; i < CARD_NUMBER; i++) {
  renderComponent(boardContainer, getCardComponent(), `beforeend`);
}
