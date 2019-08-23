import {TripInfo} from './components/trip-info';
import Menu from './components/menu';
import Filters from './components/filters';
import Sort from './components/sort';
import CardEdit from './components/card-edit';
import CardBoard from './components/card-board';
import Card from './components/card';
import {Day, tripDaysData} from "./components/day-container";
import {menus, filters, sortedWaypoints} from './data';
import {renderComponent} from "./utils";

const tripInfoContainer = document.querySelector(`.trip-info`);
const controlsContainer = document.querySelector(`.trip-controls`);
const mainContainer = document.querySelector(`.trip-events`);
const tripCostValue = document.querySelector(`.trip-info__cost-value`);
const renderQue = sortedWaypoints.slice();

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
renderComponent(tripInfoContainer, new TripInfo().getElement(), `afterbegin`);
renderComponent(controlsContainer, new Menu(menus).getElement(), `beforeend`);
renderComponent(controlsContainer, new Filters(filters).getElement(), `beforeend`);
renderComponent(mainContainer, new Sort().getElement(), `beforeend`);
renderComponent(mainContainer, new CardBoard().getElement(), `beforeend`);

const boardContainer = mainContainer.querySelector(`.trip-days`);

renderComponent(boardContainer, new Day().getElement(), `beforeend`);

const eventsContainer = mainContainer.querySelectorAll(`.trip-events__list`);
let eventContainerIndex = 0;

for (let i = 0; i < tripDaysData.length; i++) {
  if (i > 0) {
    if (tripDaysData[i].tripDay !== tripDaysData[i - 1].tripDay) {
      eventContainerIndex++;
    }
  }

  const onFormSubmit = (evt) => {
    evt.preventDefault();
    onRollbackButtonClick();
    cardEditComponent.querySelector(`.event--edit`).removeEventListener(`submit`, onFormSubmit);
  };

  const onRollbackButtonClick = () => {
    cardEditComponent.parentNode.replaceChild(cardComponent, cardEditComponent);
    cardEditComponent.removeEventListener(`click`, onRollbackButtonClick);
  };

  const onRollupButtonClick = () => {
    cardComponent.parentNode.replaceChild(cardEditComponent, cardComponent);
    cardEditComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollbackButtonClick);
    cardComponent.removeEventListener(`click`, onRollupButtonClick);
    cardEditComponent.querySelector(`.event--edit`).addEventListener(`submit`, onFormSubmit);
  };

  let cardComponent = new Card(renderQue[0]).getElement();
  let cardEditComponent = new CardEdit(renderQue[0]).getElement();

  renderComponent(eventsContainer[eventContainerIndex], cardComponent, `beforeend`);
  cardComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollupButtonClick);
  renderQue.shift();
}
