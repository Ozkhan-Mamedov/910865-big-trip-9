import {renderComponent, unrenderComponent} from "../utils";
import CardBoard from "../components/card-board";
import Day from "../components/day-container";
import Sort from "../components/sort";
import PointController from "./point-controller";

class TripController {
  /**
   * @param {Element} container
   * @param { [{duration: {hours: (string|number), minutes: (string|number), days: (string|number)},
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
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  init() {
    renderComponent(this._container, this._sort.getElement(), `beforeend`);
    renderComponent(this._container, this._board.getElement(), `beforeend`);
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, `beforeend`);

    this._waypoints.forEach((it, dayIndex) => {
      if ((dayIndex > 0) && (this._tripDaysData[dayIndex].tripDay !== this._tripDaysData[dayIndex - 1].tripDay)) {
        this._eventContainerIndex++;
      }

      this._renderTripWaypoint(it, this._eventContainerIndex);
    });

    this._sort.getElement().querySelector(`.trip-sort`).addEventListener(`click`, (evt) => this._onSortElementClick(evt));
  }

  /**
   * @param {{duration: {hours: (string|number), minutes: (string|number), days: (string|number)},
   *            startTime: number,
   *            endTime: number}} tripWaypoint
   * @param {number} containerIndex
   * @private
   */
  _renderTripWaypoint(tripWaypoint, containerIndex) {
    const pointController = new PointController(this._dayElement.querySelectorAll(`.trip-events__list`)[containerIndex], tripWaypoint, this._onDataChange, this._onChangeView);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onDataChange(newData, oldData) {
    this._waypoints[this._waypoints.findIndex((it) => it === oldData)] = newData;
    unrenderComponent(this._board.getElement());
    this._board = new CardBoard();
    renderComponent(this._container, this._board.getElement(), `beforeend`);
    this._dayElement = new Day(this._tripDaysData).getElement();
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, `beforeend`); // ?
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
   * @param {Event} evt
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
    this._board.getElement().firstElementChild.innerHTML = ``;
    this._dayElement = new Day(this._tripDaysData).getElement();
    this._eventContainerIndex = 0;
    renderComponent(this._container, this._board.getElement(), `beforeend`);
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, `beforeend`);

    switch (evt.target.dataset.sortType) {
      case `event`:
        this._waypoints.forEach((it, index) => {
          this._renderTripWaypoint(it, index);
        });
        break;

      case `time`:
        this._waypoints.slice()
          .sort((a, b) => (parseInt(a.time.duration.days, 10) - parseInt(b.time.duration.days, 10)) || (parseInt(a.time.duration.hours, 10) - parseInt(b.time.duration.hours, 10)) || (parseInt(a.time.duration.minutes, 10) - parseInt(b.time.duration.minutes, 10)))
          .forEach((it, index) => {
            this._renderTripWaypoint(it, index);
          });
        clearDaysData();
        break;

      case `price`:
        this._waypoints.slice().sort((a, b) => a.waypointPrice - b.waypointPrice).forEach((it, index) => {
          this._renderTripWaypoint(it, index);
        });
        clearDaysData();
        break;
    }
  }
}

export default TripController;
