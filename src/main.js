import {TripInfo} from './components/trip-info';
import Menu from './components/menu';
import Filters from './components/filters';
import NoPoints from "./components/no-points";
import {menus, filters} from './data';
import ModelPoint from "./model-point";
import {renderComponent, unrenderComponent, Position, getDaysData} from "./utils";
import TripController from "./controllers/trip-controller";
import API from "./api";

const AUTHORIZATION = `Basic er883jdzbdw${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const tripInfoContainer = document.querySelector(`.trip-info`);
const controlsContainer = document.querySelector(`.trip-controls`);
const mainContainer = document.querySelector(`.trip-events`);
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
let waypoints = null;

const onDataChange = (actionType, update) => {
  console.log(update);
  switch (actionType) {
    case `delete`:
      api.deleteWaypoint({
        id: update.id
      })
        .then(() => api.getWaypoints({url: `points`}))
        .then((waypointData) => {
          waypoints = ModelPoint.parseWaypoints(waypointData);
        });
      break;

    case `update`:
      api.updateWaypoint({
        id: update.id,
        data: toRAW(update)
      })
        .then(() => api.getWaypoints({url: `points`}))
        .then((waypointData) => {
          waypoints = ModelPoint.parseWaypoints(waypointData);
        });
      break;

    case `create`:
      api.createWaypoint({
        waypoint: toRAW(update)
      })
        .then(() => api.getWaypoints({url: `points`}))
        .then((waypointData) => {
          waypoints = ModelPoint.parseWaypoints(waypointData);
        });
      break;
  }
};

const toRAW = (data) => {
  return {
    'type': data.type.address.substring(0, data.type.address.length - 4),
    'destination': {
      name: data.city,
      description: data.description,
      pictures: data.photos,
    },
    'base_price': data.waypointPrice,
    'date_from': data.time.startTime,
    'date_to': data.time.endTime,
    'id': data.id,
    'offers': data.offers.map((it) => {
      return {
        title: it.title,
        price: it.price,
      };
    }),
    'is_favorite': data.isFavorite,
  };
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
   *             photos: [string],
   *             isFavorite: boolean } ] } filteredWaypoints
   */
  const presetFilteredPage = (filteredWaypoints) => {
    tripDaysData = getDaysData(filteredWaypoints);
    tripController.unrenderTripBoard();
    tripController = new TripController(mainContainer, filteredWaypoints, tripDaysData, tripCityDescriptions, tripTypeOffers, onDataChange);
    tripController.init();
    tripController._hideStatistics();
    controlsContainer.querySelector(`.trip-tabs`).children[1].classList.remove(`trip-tabs__btn--active`);
    controlsContainer.querySelector(`.trip-tabs`).children[0].classList.add(`trip-tabs__btn--active`);
  };

  const onResetButtonClick = () => {
    unrenderComponent(document.querySelector(`.event--edit`));
    tripController._setNewWaypointStatus();
  };

  const onAddButtonClick = () => {
    tripController._createTripWaypoint();
    document.querySelector(`.event__reset-btn`).addEventListener(`click`, onResetButtonClick);
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

  //renderComponent(tripInfoContainer, new TripInfo(sortedWaypoints).getElement(), Position.AFTERBEGIN); // in
  renderComponent(controlsContainer, new Menu(menus).getElement(), Position.BEFOREEND);
  renderComponent(controlsContainer, new Filters(filters).getElement(), Position.BEFOREEND);

  let tripDaysData = null;
  let tripController = null;
  let tripTypeOffers = null;
  let tripCityDescriptions = null;

  api.getWaypoints({url: `offers`})
    .then((offers) => {
      tripTypeOffers = offers;
    })
    .then(() => api.getWaypoints({url: `destinations`}))
    .then((descriptions) => {
      tripCityDescriptions = descriptions;
    })
    .then(() => api.getWaypoints({url: `points`}))
    .then((waypointData) => {
      //waypoints = waypointData.slice().map((it) => new ModelPoint(it));
      waypoints = ModelPoint.parseWaypoints(waypointData);
      tripDaysData = getDaysData(waypoints);
      renderComponent(tripInfoContainer, new TripInfo(waypoints).getElement(), Position.AFTERBEGIN);
      tripController = new TripController(mainContainer, waypoints, tripDaysData, tripCityDescriptions, tripTypeOffers, onDataChange);
      tripController.init();
      //tripCostValue.textContent = `${getTripCostValue(waypoints)}`;
      tripController._hideStatistics();
      checkTasksState();
      controlsContainer.querySelector(`.trip-filters`).addEventListener(`click`, (evt) => {
        switch (evt.target.value) {
          case `everything`:
            presetFilteredPage(waypoints);
            break;

          case `future`:
            const futureWaypoints = waypoints.filter((it) => it.time.startTime > Date.now());

            presetFilteredPage(futureWaypoints);
            break;

          case `past`:
            const pastWaypoints = waypoints.filter((it) => it.time.startTime < Date.now());

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
    });
  /*
  let tripDaysData = getDaysData(sortedWaypoints);
  let tripController = new TripController(mainContainer, sortedWaypoints, tripDaysData);

  tripController.init();
  //tripCostValue.textContent = `${getTripCostValue(sortedWaypoints)}`;
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

  document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, onAddButtonClick);*/
};

generatePageElements();
