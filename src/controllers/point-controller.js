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
   *             photos: [string],
   *             isFavorite: boolean } } data
   * @param { {
   *    ADDING: string,
   *    DEFAULT: string
   *    } } mode
   * @param {function} onDataChange
   * @param {function} onChangeView
   */
  constructor(container, data, mode, onDataChange, onChangeView, cityDescriptionData, tripTypeOffers) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._cardComponent = new Card(data).getElement();
    this._cardEditComponent = new CardEdit(data, cityDescriptionData, tripTypeOffers).getElement();

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
      let entry = {
        type: {
          address: imageName,
          template: this._cardEditComponent.querySelector(`.event__type-output`).outerText
        },
        city: formData.get(`event-destination`),
        waypointPrice: parseInt(formData.get(`event-price`), 10),
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
        offers: [...this._cardEditComponent.querySelectorAll(`.event__offer-checkbox`)].map((it) => {
          return {
            price: parseInt(it.labels[0].lastElementChild.textContent, 10),
            title: it.labels[0].firstElementChild.textContent,
            isSelected: it.checked
          };
        }),
        isFavorite: !!formData.get(`event-favorite`),
        id: this._data.id.toString(),
        description: this._cardEditComponent.querySelector(`.event__destination-description`).textContent,
        photos: [...this._cardEditComponent.querySelectorAll(`.event__photo`)].map((it) => {
          return {
            src: it.src,
            description: it.alt,
          };
        }),
      };
      console.log(entry);

      /*if (mode === TripControllerMode.ADDING) {
        entry.description = ``;
        entry.photos = ``;
      }*/
      /*if (mode === TripControllerMode.DEFAULT) {
        entry.description = parseInt(this._cardEditComponent.querySelector(`.event__destination-description`).textContent, 10);
        entry.photos = Array.from(this._cardEditComponent.querySelectorAll(`.event__photo`)).map((it) => it.src);
      }*/
      this._onDataChange(entry, mode === TripControllerMode.ADDING ? null : this._data);
      onRollbackButtonClick();
      this._cardEditComponent.querySelector(`.event--edit`).removeEventListener(`click`, onFormSubmit);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    if (mode === TripControllerMode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
      currentView = this._cardEditComponent;

      currentView.querySelector(`.event__save-btn`).addEventListener(`click`, onFormSubmit);
    }
    this._cardEditComponent.querySelector(`.event__type-toggle`).addEventListener(`click`, () => {
      this._cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, onListElementClick);
    });

    /**
     * @param {MouseEvent} clickEvt
     */
    const onListElementClick = (clickEvt) => {
      if (clickEvt.target.tagName === `INPUT`) {
        this._cardEditComponent.querySelector(`.event__type-toggle`).checked = ``;
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
                this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`drive`].template;
                break;

              case `flight`:
                this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/flight.png`;
                this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`flight`].template;
                break;

              case `check-in`:
                this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/check-in.png`;
                this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`check-in`].template;
                break;

              case `sightseeing`:
                this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/sightseeing.png`;
                this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`sightseeing`].template;
                break;

              case `restaurant`:
                this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/restaurant.png`;
                this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`restaurant`].template;
                break;
            }
          }
        });
        this._cardEditComponent.querySelector(`.event__type-list`).removeEventListener(`click`, onListElementClick);
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
        this._cardEditComponent.parentNode.replaceChild(currentView, this._cardEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onRollbackButtonClick = () => {
      this._cardEditComponent.parentNode.replaceChild(currentView, this._cardEditComponent);
      this._cardEditComponent.removeEventListener(`click`, onRollbackButtonClick);
      this._cardEditComponent.querySelector(`.event__reset-btn`).removeEventListener(`click`, onDeleteButtonClick);
    };

    const onRollupButtonClick = () => {
      this._onChangeView();
      currentView.parentNode.replaceChild(this._cardEditComponent, currentView);
      this._cardEditComponent.querySelector(`.event__reset-btn`).addEventListener(`click`, onDeleteButtonClick);
      this._cardEditComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollbackButtonClick);
      currentView.removeEventListener(`click`, onRollupButtonClick);
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
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`drive`].template;
              break;

            case `flight`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/flight.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`flight`].template;
              break;

            case `check-in`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/check-in.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`check-in`].template;
              break;

            case `sightseeing`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/sightseeing.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`sightseeing`].template;
              break;

            case `restaurant`:
              this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/restaurant.png`;
              this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`restaurant`].template;
              break;
          }
        }
      });
      this._cardEditComponent.querySelector(`.event__save-btn`).addEventListener(`click`, onFormSubmit);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    renderComponent(this._container, currentView, renderPosition);
    currentView.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollupButtonClick);
  }
}

export default PointController;
