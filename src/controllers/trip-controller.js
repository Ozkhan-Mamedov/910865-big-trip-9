import {renderComponent} from "../utils";
import CardBoard from "../components/card-board";
import Day from "../components/day-container";
import Card from "../components/card";
import Sort from "../components/sort";
import CardEdit from "../components/card-edit";

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
  }

  init() {
    renderComponent(this._container, this._sort.getElement(), `beforeend`);
    renderComponent(this._container, this._board.getElement(), `beforeend`);
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, `beforeend`);

    this._waypoints.forEach((it, index) => {
      this._renderTripWaypoint(it, index);
    });

    this._sort.getElement().querySelector(`.trip-sort`).addEventListener(`click`, (evt) => this._onSortElementClick(evt));
  }

  /**
   * @param {{duration: {hours: (string|number), minutes: (string|number), days: (string|number)},
   *            startTime: number,
   *            endTime: number}} tripWaypoint
   * @param {number} index
   * @private
   */
  _renderTripWaypoint(tripWaypoint, index) {
    const cardComponent = new Card(tripWaypoint).getElement();
    const cardEditComponent = new CardEdit(tripWaypoint).getElement();

    /**
     * @param {KeyboardEvent} keyEvt
     */
    const onEscKeyDown = (keyEvt) => {
      if (keyEvt.key === `Escape` || keyEvt.key === `Esc`) {
        cardEditComponent.parentNode.replaceChild(cardComponent, cardEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    /**
     * @param {Event} evt
     */
    const onFormSubmit = (evt) => {
      evt.preventDefault();
      onRollbackButtonClick();
      cardEditComponent.querySelector(`.event--edit`).removeEventListener(`submit`, onFormSubmit);
      document.removeEventListener(`keydown`, onEscKeyDown);
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
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    if ((index > 0) && (this._tripDaysData[index].tripDay !== this._tripDaysData[index - 1].tripDay)) {
      this._eventContainerIndex++;
    }
    renderComponent(this._dayElement.querySelectorAll(`.trip-events__list`)[this._eventContainerIndex], cardComponent, `beforeend`);
    cardComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollupButtonClick);
  }

  /**
   * @param {Event} evt
   * @private
   */
  _onSortElementClick(evt) {
    const clearDaysData = () => {
      document.querySelectorAll(`.day__counter`).forEach((it) => {
        it.innerHTML = ``;
      });
      document.querySelectorAll(`.day__date`).forEach((it) => {
        it.innerHTML = ``;
      });
    };

    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._board.getElement().firstElementChild.innerHTML = ``;
    this._board = new CardBoard();
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
