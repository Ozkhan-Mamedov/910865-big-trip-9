import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {renderComponent, Position} from "../utils";
import {offersData} from "../constants";
import {waypointType, TripControllerMode} from "../constants";
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
   * @param { [{name: string, description: string, pictures: [ {src: string, description: string} ]}] } cityDescriptionData
   * @param { [{type: string, offers: [ {name: string, title: string, price: number} ]}] } tripTypeOffers
   */
  constructor(container, data, mode, onDataChange, onChangeView, cityDescriptionData, tripTypeOffers) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._cardComponent = new Card(data).getElement();
    this._cardEditComponent = new CardEdit(data, cityDescriptionData, tripTypeOffers).getElement();
    this._cityDescriptionData = cityDescriptionData;
    this._tripTypeOffers = tripTypeOffers;

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

    const onCityInputChange = () => {
      const currentCity = this._cardEditComponent.querySelector(`.event__input`).value;
      const currentCityIndex = this._cityDescriptionData.findIndex((it) => it.name === currentCity);
      const currentCityPictures = this._cityDescriptionData[currentCityIndex].pictures;
      const cureentCityDescription = this._cityDescriptionData[currentCityIndex].description;

      this._cardEditComponent.querySelector(`.event__photos-tape`).innerHTML = ``;
      currentCityPictures.forEach((it) => {
        const pictureElement = `<img class="event__photo" src="${it.src}" alt="${it.description}">`;

        this._cardEditComponent.querySelector(`.event__photos-tape`).innerHTML += pictureElement;
      });
      this._cardEditComponent.querySelector(`.event__destination-description`).textContent = cureentCityDescription;
    };

    /**
     * @param {Event} evt
     */
    const onFormSubmit = (evt) => {
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

      this._onDataChange(entry, mode === TripControllerMode.ADDING ? null : this._data);
      onRollbackButtonClick();
      this._cardEditComponent.querySelector(`.event--edit`).removeEventListener(`click`, onFormSubmit);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    if (mode === TripControllerMode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
      currentView = this._cardEditComponent;

      currentView.querySelector(`.event__save-btn`).addEventListener(`click`, onFormSubmit);
      currentView.querySelector(`.event__input`).addEventListener(`change`, onCityInputChange);
    }
    this._cardEditComponent.querySelector(`.event__type-toggle`).addEventListener(`click`, () => {
      this._cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, onListElementClick);
    });

    const changeOffer = (offers) => {
      if (offers.length !== 0) {
        if (this._cardEditComponent.querySelector(`.event__section--offers`).classList.contains(`visually-hidden`)) {
          this._cardEditComponent.querySelector(`.event__section--offers`).classList.remove(`visually-hidden`);
        }
        this._cardEditComponent.querySelector(`.event__available-offers`).innerHTML = ``;
        offers.forEach((it) => {
          const offerElement = `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offersData.find((offer) => offer.name === it.name).id}-${this._data.id}" type="checkbox" name="${offersData.find((offer) => offer.name === it.name).id}">
              <label class="event__offer-label" for="event-offer-${offersData.find((offer) => offer.name === it.name).id}-${this._data.id}">
                <span class="event__offer-title">${it.name}</span>
                +
                €&nbsp;<span class="event__offer-price">${it.price}</span>
              </label>
            </div>
          `;

          this._cardEditComponent.querySelector(`.event__available-offers`).innerHTML += offerElement;
        });
      } else {
        this._cardEditComponent.querySelector(`.event__section--offers`).classList.add(`visually-hidden`);
        this._cardEditComponent.querySelector(`.event__available-offers`).innerHTML = ``;
      }
    };

    /**
     * @param {string} type
     * @return {*}
     */
    const changeTypeData = (type) => {
      this._cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/${type}.png`;
      this._cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[type].template;

      return this._tripTypeOffers.find((it) => it.type === type).offers;
    };

    /**
     * @param {MouseEvent} clickEvt
     */
    const onListElementClick = (clickEvt) => {
      if (clickEvt.target.tagName === `INPUT`) {
        this._cardEditComponent.querySelector(`.event__type-toggle`).checked = ``;
        this._cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
          if (evt.target.tagName === `INPUT`) {
            let currentOffers;

            switch (evt.target.value) {
              case `taxi`:
                currentOffers = changeTypeData(`taxi`);
                changeOffer(currentOffers);
                break;

              case `bus`:
                currentOffers = changeTypeData(`bus`);
                changeOffer(currentOffers);
                break;

              case `train`:
                currentOffers = changeTypeData(`train`);
                changeOffer(currentOffers);
                break;

              case `ship`:
                currentOffers = changeTypeData(`ship`);
                changeOffer(currentOffers);
                break;

              case `transport`:
                currentOffers = changeTypeData(`transport`);
                changeOffer(currentOffers);
                break;

              case `drive`:
                currentOffers = changeTypeData(`drive`);
                changeOffer(currentOffers);
                break;

              case `flight`:
                currentOffers = changeTypeData(`flight`);
                changeOffer(currentOffers);
                break;

              case `check-in`:
                currentOffers = changeTypeData(`check-in`);
                changeOffer(currentOffers);
                break;

              case `sightseeing`:
                currentOffers = changeTypeData(`sightseeing`);
                changeOffer(currentOffers);
                break;

              case `restaurant`:
                currentOffers = changeTypeData(`restaurant`);
                changeOffer(currentOffers);
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
      [`time_24hr`]: true,
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
      this._cardEditComponent.querySelector(`.event--edit`).reset();
      this._cardEditComponent.parentNode.replaceChild(currentView, this._cardEditComponent);
      this._cardEditComponent.removeEventListener(`click`, onRollbackButtonClick);
      this._cardEditComponent.querySelector(`.event__input`).removeEventListener(`change`, onCityInputChange);
      this._cardEditComponent.querySelector(`.event__reset-btn`).removeEventListener(`click`, onDeleteButtonClick);
    };

    const onRollupButtonClick = () => {
      this._onChangeView();
      currentView.parentNode.replaceChild(this._cardEditComponent, currentView);
      this._cardEditComponent.querySelector(`.event__reset-btn`).addEventListener(`click`, onDeleteButtonClick);
      this._cardEditComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollbackButtonClick);
      currentView.removeEventListener(`click`, onRollupButtonClick);
      this._cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, onListElementClick);
      this._cardEditComponent.querySelector(`.event__input`).addEventListener(`change`, onCityInputChange);
      this._cardEditComponent.querySelector(`.event__save-btn`).addEventListener(`click`, onFormSubmit);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    renderComponent(this._container, currentView, renderPosition);
    if (this._data.offers.length === 0) {
      this._cardEditComponent.querySelector(`.event__section--offers`).classList.add(`visually-hidden`);
      this._cardEditComponent.querySelector(`.event__available-offers`).innerHTML = ``;
    }
    currentView.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollupButtonClick);
  }
}

export default PointController;
