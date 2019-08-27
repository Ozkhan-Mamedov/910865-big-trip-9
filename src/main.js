import {TripInfo} from './components/trip-info';
import Menu from './components/menu';
import Filters from './components/filters';
import Sort from './components/sort';
import NoPoints from "./components/no-points";
import {menus, filters, sortedWaypoints} from './data';
import {renderComponent, unrenderComponent} from "./utils";
import TripController from "./controllers/trip-controller";

const tripInfoContainer = document.querySelector(`.trip-info`);
const controlsContainer = document.querySelector(`.trip-controls`);
const mainContainer = document.querySelector(`.trip-events`);
const tripCostValue = document.querySelector(`.trip-info__cost-value`);

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
  const additionalOffersPrice = document.querySelectorAll(`.event__offer-price`);

  waypointList.forEach((it) => {
    sum += it.waypointPrice;
  });

  additionalOffersPrice.forEach((it) => {
    sum += parseInt(it.textContent, 10);
  });

  return sum;
};

const generatePageElements = () => {
  const checkTasksState = () => {
    const boardContainer = mainContainer.querySelector(`.trip-days`);

    if (boardContainer.firstElementChild.childElementCount === 0) {
      Array.from(mainContainer.children).forEach((it) => {
        unrenderComponent(it);
      });
      renderComponent(mainContainer, new NoPoints().getElement(), `beforeend`);
    }
  };

  renderComponent(tripInfoContainer, new TripInfo().getElement(), `afterbegin`);
  renderComponent(controlsContainer, new Menu(menus).getElement(), `beforeend`);
  renderComponent(controlsContainer, new Filters(filters).getElement(), `beforeend`);
  renderComponent(mainContainer, new Sort().getElement(), `beforeend`);

  const tripController = new TripController(mainContainer, sortedWaypoints);

  tripController.init();
  tripCostValue.textContent = `${getTripCostValue(sortedWaypoints)}`;
  checkTasksState();
};

generatePageElements();
