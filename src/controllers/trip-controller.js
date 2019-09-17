import {renderComponent, unrenderComponent, getRandomNumber, Position} from "../utils";
import CardBoard from "../components/card-board";
import Day from "../components/day-container";
import Sort from "../components/sort";
import PointController from "./point-controller";
import {cities, TripControllerMode, waypointTypeNames, waypointType} from "../constants";

class TripController {
  /**
   * @param {Element} container
   * @param { [{duration: {hours: number, minutes: number, days: number},
   *            startTime: number,
   *            endTime: number}] } waypoints
   * @param { [ {
   *   tripDay: number,
   *   day: number,
   *   month: string,
   *   dayCode: number
   *        } ] } tripDaysData
   */
  constructor(container, waypoints, tripDaysData) {
    this._container = container;
    this._waypoints = waypoints;
    this._tripDaysData = tripDaysData;
    this._eventContainerIndex = 0;
    this._board = new CardBoard();
    this._sort = new Sort();
    this._dayElement = new Day(tripDaysData).getElement();
    this._subscriptions = [];
    this._creatingWaypoint = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  init() {
    renderComponent(this._container, this._sort.getElement(), Position.BEFOREEND);
    renderComponent(this._container, this._board.getElement(), Position.BEFOREEND);
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, Position.BEFOREEND);

    this._waypoints.forEach((it, dayIndex) => {
      if ((dayIndex > 0) && (this._tripDaysData[dayIndex].tripDay !== this._tripDaysData[dayIndex - 1].tripDay)) {
        this._eventContainerIndex++;
      }

      this._renderTripWaypoint(it, this._eventContainerIndex);
    });

    this._sort.getElement().querySelector(`.trip-sort`).addEventListener(`click`, (evt) => this._onSortElementClick(evt));
  }

  /**
   * @param {{duration: {hours: number, minutes: number, days: number},
   *            startTime: number,
   *            endTime: number}} tripWaypoint
   * @param {number} containerIndex
   * @private
   */
  _renderTripWaypoint(tripWaypoint, containerIndex) {
    const pointController = new PointController(this._dayElement.querySelectorAll(`.trip-events__list`)[containerIndex], tripWaypoint, TripControllerMode.DEFAULT, this._onDataChange, this._onChangeView);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _createTripWaypoint() {
    if (this._creatingWaypoint) {
      return;
    }

    const defaultWaypoint = {
      type: waypointType[waypointTypeNames[getRandomNumber(0, waypointTypeNames.length - 1)]],
      city: cities[getRandomNumber(0, cities.length - 1)],
      waypointPrice: 0,
      time: {
        startTime: new Date(),
        endTime: new Date(),
      },
      description: ``,
      photos: [],
      offers: new Set(),
    };
    this._creatingWaypoint = new PointController(this._board.getElement().firstElementChild, defaultWaypoint, TripControllerMode.ADDING, this._onDataChange, this._onChangeView);
  }

  /**
   * @param { { offers: Set < {} >,
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
   *             photos: [string] } } newData
   * @param { { offers: Set < {} >,
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
   *             photos: [string] } } oldData
   * @private
   */
  _onDataChange(newData, oldData) {
    this._waypoints[this._waypoints.findIndex((it) => it === oldData)] = newData;
    if (newData === null) {
      this._waypoints.splice(this._waypoints.findIndex((it) => it === newData), 1);
    }
    if (oldData === null) {
      this._waypoints.unshift(newData);
      this._creatingWaypoint = null;
    }
    unrenderComponent(this._board.getElement());
    this._board = new CardBoard();
    renderComponent(this._container, this._board.getElement(), Position.BEFOREEND);
    this._dayElement = new Day(this._tripDaysData).getElement();
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, Position.BEFOREEND); // ?
    this._eventContainerIndex = 0;
    this._waypoints.forEach((it, dayIndex) => {
      if ((dayIndex > 0) && (this._tripDaysData[dayIndex].tripDay !== this._tripDaysData[dayIndex - 1].tripDay)) {
        this._eventContainerIndex++;
      }
      this._renderTripWaypoint(it, this._eventContainerIndex);
    });
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  /**
   * @param {MouseEvent} evt
   * @private
   */
  _onSortElementClick(evt) {
    const clearDaysData = () => {
      document.querySelectorAll(`.day__counter`).forEach((it) => {
        unrenderComponent(it);
      });
      document.querySelectorAll(`.day__date`).forEach((it) => {
        unrenderComponent(it);
      });
    };

    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    unrenderComponent(this._board.getElement());
    this._board = new CardBoard();
    renderComponent(this._container, this._board.getElement(), Position.BEFOREEND);
    this._dayElement = new Day(this._tripDaysData).getElement();
    this._eventContainerIndex = 0;
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, Position.BEFOREEND);

    switch (evt.target.dataset.sortType) {
      case `event`:
        this._waypoints.forEach((it, index) => {
          if ((index > 0) && (this._tripDaysData[index].tripDay !== this._tripDaysData[index - 1].tripDay)) {
            this._eventContainerIndex++;
          }
          this._renderTripWaypoint(it, this._eventContainerIndex);
        });
        break;

      case `time`:
        this._waypoints.slice()
          .sort((a, b) => (parseInt(a.time.duration.days, 10) - parseInt(b.time.duration.days, 10)) || (parseInt(a.time.duration.hours, 10) - parseInt(b.time.duration.hours, 10)) || (parseInt(a.time.duration.minutes, 10) - parseInt(b.time.duration.minutes, 10)))
          .forEach((it, index) => {
            if ((index > 0) && (this._tripDaysData[index].tripDay !== this._tripDaysData[index - 1].tripDay)) {
              this._eventContainerIndex++;
            }
            this._renderTripWaypoint(it, this._eventContainerIndex);
          });
        clearDaysData();
        break;

      case `price`:
        this._waypoints.slice().sort((a, b) => a.waypointPrice - b.waypointPrice).forEach((it, index) => {
          if ((index > 0) && (this._tripDaysData[index].tripDay !== this._tripDaysData[index - 1].tripDay)) {
            this._eventContainerIndex++;
          }
          this._renderTripWaypoint(it, this._eventContainerIndex);
        });
        clearDaysData();
        break;
    }
  }

  _showStatistics() {
    document.querySelector(`.statistics`).classList.remove(`visually-hidden`);
    this._board.getElement().classList.add(`visually-hidden`);
    this._sort.getElement().classList.add(`visually-hidden`);
  }

  _hideStatistics() {
    document.querySelector(`.statistics`).classList.add(`visually-hidden`);
    this._board.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
  }
}

export default TripController;
