import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {renderComponent, Position} from "../utils";
import {waypointType, additionalOffers, TripControllerMode} from "../constants";
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';


class PointController {
  /**
   * @param {Element} container
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
   *             photos: [string] } } data
   * @param { {
   *    ADDING: string,
   *    DEFAULT: string
   *    } } mode
   * @param {function} onDataChange
   * @param {function} onChangeView
   */
  constructor(container, data, mode, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._cardComponent = new Card(data).getElement();
    this._cardEditComponent = new CardEdit(data).getElement();

    this.init(mode);
  }

  setDefaultView() {
    if (this._container.contains(this._cardEditComponent)) {
      this._container.replaceChild(this._cardComponent, this._cardEditComponent);
    }
  }

  /**
   * @param { {
   *    ADDING: string,
   *    DEFAULT: string
   *    } } mode
   */
  init(mode) {
    let currentView = this._cardComponent;
    let renderPosition = Position.BEFOREEND;

    if (mode === TripControllerMode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
      currentView = this._cardEditComponent;
    }
    this._cardEditComponent.querySelector(`.event__type-toggle`).addEventListener(`click`, () => {
      this._cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, handler);
    });

    /**
     * @param {MouseEvent} clickEvt
     */
    const handler = (clickEvt) => {
      if (clickEvt.target.tagName === `INPUT`) {
        this._cardEditComponent.querySelector(`.event__type-toggle`).checked = ``;
        this._cardEditComponent.querySelector(`.event__type-list`).removeEventListener(`click`, handler);
      }
    };

    const onDeleteButtonClick = () => {
      this._onDataChange(null, this._data);
    };

    flatpickr(this._cardEditComponent
      .querySelectorAll(`.event__input--time`),
    {
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      time_24hr: true,
    }
    );

    /**
     * @param {KeyboardEvent} keyEvt
     */
    const onEscKeyDown = (keyEvt) => {
      if (keyEvt.key === `Escape` || keyEvt.key === `Esc`) {
        // Интересный факт. Eсли убрать комментарий, то ошибка срабатывает 1 раз
        // после чего обработчик удаляется
        // document.removeEventListener(`keydown`, onEscKeyDown);
        this._cardEditComponent.parentNode.replaceChild(this._cardComponent, this._cardEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    /**
     * @param {Event} evt
     */
    const onFormSubmit = (evt) => {
      /**
       * @param {[string]} data
       * @return {Set<{}>}
       */
      const getOfferData = (data) => {
        let offerData = new Set();

        data.forEach((it) => {
          additionalOffers.find((offer) => offer.id === it).isSelected = true;
          offerData.add(additionalOffers.find((offer) => offer.id === it));
        });

        return offerData;
      };

      evt.preventDefault();

      const formData = new FormData(this._cardEditComponent.querySelector(`.event--edit`));
      const pathDirectories = this._cardEditComponent.querySelector(`.event__type-icon`).src.split(`/`);
      const imageName = pathDirectories[pathDirectories.length - 1];
      const entry = {
        type: {
          address: imageName,
          template: this._cardEditComponent.querySelector(`.event__type-output`).outerText
        },
        city: formData.get(`event-destination`),
        waypointPrice: parseInt(formData.get(`event-price`), 10),
        photos: Array.from(this._cardEditComponent.querySelectorAll(`.event__photo`)).map((it) => it.src),
        time: {
          duration: {
            get days() {
              return moment.duration(entry.time.endTime - entry.time.startTime, `milliseconds`).days();
            },
            get minutes() {
              return moment.duration(entry.time.endTime - entry.time.startTime, `milliseconds`).minutes();
            },
            get hours() {
              return moment.duration(entry.time.endTime - entry.time.startTime, `milliseconds`).hours();
            }
          },
          endTime: moment(formData.get(`event-end-time`), `DD/MM/YYYY hh:mm`).valueOf(),
          startTime: moment(formData.get(`event-start-time`), `DD/MM/YYYY hh:mm`).valueOf()
        },
        description: this._cardEditComponent.querySelector(`.event__destination-description`).textContent,
        offers: getOfferData(formData.getAll(`event-offer`)),
      };

      this._onDataChange(entry, this._data);
      onRollbackButtonClick();
      this._cardEditComponent.querySelector(`.event--edit`).removeEventListener(`submit`, onFormSubmit);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onRollbackButtonClick = () => {
      this._cardEditComponent.parentNode.replaceChild(this._cardComponent, this._cardEditComponent);
      this._cardEditComponent.removeEventListener(`click`, onRollbackButtonClick);
      this._cardEditComponent.querySelector(`.event__reset-btn`).removeEventListener(`click`, onDeleteButtonClick);
    };

    const onRollupButtonClick = () => {
      this._onChangeView();
      this._cardComponent.parentNode.replaceChild(this._cardEditComponent, this._cardComponent);
      this._cardEditComponent.querySelector(`.event__reset-btn`).addEventListener(`click`, onDeleteButtonClick);
      this._cardEditComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollbackButtonClick);
      this._cardComponent.removeEventListener(`click`, onRollupButtonClick);
      this._cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          switch (evt.target.value) {
            case `taxi`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/taxi.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`taxi`].template;
              break;

            case `bus`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/bus.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`bus`].template;
              break;

            case `train`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/train.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`train`].template;
              break;

            case `ship`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/ship.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`ship`].template;
              break;

            case `transport`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/transport.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`transport`].template;
              break;

            case `drive`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/drive.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`car`].template;
              break;

            case `flight`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/flight.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`plane`].template;
              break;

            case `check-in`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/check-in.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`hotel`].template;
              break;

            case `sightseeing`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/sightseeing.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`sight`].template;
              break;

            case `restaurant`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/restaurant.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`restaurant`].template;
              break;
          }
        }
      });
      this._cardEditComponent.querySelector(`.event--edit`).addEventListener(`submit`, onFormSubmit);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    renderComponent(this._container, currentView, renderPosition);
    this._cardComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollupButtonClick);
  }
}

export default PointController;
