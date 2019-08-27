import {renderComponent} from "../utils";
import CardBoard from "../components/card-board";
import {Day, tripDaysData} from "../components/day-container";
import Card from "../components/card";
import CardEdit from "../components/card-edit";

class TripController {
  constructor(container, waypoints) {
    this._container = container;
    this._waypoints = waypoints;
    this._tripDaysData = tripDaysData;
    this._eventContainerIndex = 0;
    this._board = new CardBoard();
    this._dayElement = new Day().getElement();
  }

  init() {
    renderComponent(this._container, this._board.getElement(), `beforeend`);
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, `beforeend`);
    this._waypoints.forEach((it, index) => {
      const cardComponent = new Card(it).getElement();
      const cardEditComponent = new CardEdit(it).getElement();

      /**
       * @param {KeyboardEvent} keyEvt
       */
      const onEscKeyDown = (keyEvt) => {
        if (keyEvt.key === `Escape` || keyEvt.key === `Esc`) {
          cardEditComponent.parentNode.replaceChild(cardComponent, cardEditComponent);
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

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
    });
  }
}

export default TripController;
