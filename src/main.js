import {TripInfo} from './components/trip-info';
import Menu from './components/menu';
import Filters from './components/filters';
import NoPoints from "./components/no-points";
import {menus, filters, sortedWaypoints} from './data';
import {renderComponent, unrenderComponent, Position, getDaysData} from "./utils";
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
 *             photos: [string] } ] } waypointList
 * @return {number}
 */
const getTripCostValue = (waypointList) => {
  let sum = 0;
  const additionalOffersPrice = mainContainer.querySelectorAll(`.event__offer-price`);

  waypointList.forEach((it) => {
    sum += it.waypointPrice;
  });

  additionalOffersPrice.forEach((it) => {
    sum += parseInt(it.textContent, 10);
  });

  return sum;
};

const generatePageElements = () => {
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
   */
  const presetFilteredPage = (waypoints) => {
    tripDaysData = getDaysData(waypoints);
    tripController.unrenderTripBoard();
    tripController = new TripController(mainContainer, waypoints, tripDaysData);
    tripController.init();
    controlsContainer.querySelector(`.trip-tabs`).children[1].classList.remove(`trip-tabs__btn--active`);
    controlsContainer.querySelector(`.trip-tabs`).children[0].classList.add(`trip-tabs__btn--active`);
    tripController._hideStatistics();
  };

  const onAddButtonClick = () => {
    tripController._createTripWaypoint();
    document.querySelector(`.event__reset-btn`).addEventListener(`click`, () => {
      unrenderComponent(document.querySelector(`.event--edit`));
    });
  };

  const checkTasksState = () => {
    const boardContainer = mainContainer.querySelector(`.trip-days`);

    if (boardContainer.firstElementChild.childElementCount === 0) {
      Array.from(mainContainer.children).forEach((it) => {
        unrenderComponent(it);
      });
      renderComponent(mainContainer, new NoPoints().getElement(), Position.BEFOREEND);
    }
  };

  renderComponent(tripInfoContainer, new TripInfo().getElement(), Position.AFTERBEGIN);
  renderComponent(controlsContainer, new Menu(menus).getElement(), Position.BEFOREEND);
  renderComponent(controlsContainer, new Filters(filters).getElement(), Position.BEFOREEND);

  let tripDaysData = getDaysData(sortedWaypoints);
  let tripController = new TripController(mainContainer, sortedWaypoints, tripDaysData);

  tripController.init();
  tripCostValue.textContent = `${getTripCostValue(sortedWaypoints)}`;
  tripController._hideStatistics();
  checkTasksState();
  controlsContainer.querySelector(`.trip-filters`).addEventListener(`click`, (evt) => {
    switch (evt.target.value) {
      case `everything`:
        presetFilteredPage(sortedWaypoints);
        break;

      case `future`:
        const futureWaypoints = sortedWaypoints.filter((it) => it.time.startTime > Date.now());

        presetFilteredPage(futureWaypoints);
        break;

      case `past`:
        const pastWaypoints = sortedWaypoints.filter((it) => it.time.startTime < Date.now());

        presetFilteredPage(pastWaypoints);
        break;
    }
  });
  controlsContainer.querySelector(`.trip-tabs`).addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    switch (evt.target.text) {
      case `Table`:
        evt.currentTarget.children[1].classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        tripController._hideStatistics();
        break;

      case `Stats`:
        evt.currentTarget.children[0].classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        tripController._showStatistics();
        break;
    }
  });

  document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, onAddButtonClick);
};

generatePageElements();
