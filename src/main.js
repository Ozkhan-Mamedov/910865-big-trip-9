import {getRouteInfoComponent} from './components/route-info';
import {getMenuComponent} from './components/menu';
import {getFiltersComponent} from './components/filters';
import {getSortComponents} from './components/sort';
import {getCardEditComponent} from './components/card-edit';
import {getCardBoardComponent} from './components/card-board';
import {getCardComponent} from './components/card';
import {} from './data';

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
renderComponent(mainContainer, getCardBoardComponent(), `beforeend`);

const CARD_NUMBER = 3;
const boardContainer = mainContainer.querySelector(`.trip-days`);

for (let i = 0; i < CARD_NUMBER; i++) {
  renderComponent(boardContainer, getCardComponent(), `beforeend`);
}

const cardEditBoardContainer = document.querySelector(`.trip-events__list`);

cardEditBoardContainer.firstElementChild.innerHTML = ``;
renderComponent(cardEditBoardContainer.firstElementChild, getCardEditComponent(), `afterbegin`);
