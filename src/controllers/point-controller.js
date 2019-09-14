import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {renderComponent} from "../utils";
import {waypointType, additionalOffers} from "../constants";
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';


class PointController {
  constructor(container, data, onDataChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;

    this.init();
  }

  init() {
    const cardComponent = new Card(this._data).getElement();
    const cardEditComponent = new CardEdit(this._data).getElement();

    cardEditComponent.querySelector(`.event__type-toggle`).addEventListener(`click`, () => {
      cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, handler);
    });

    const handler = (clickEvt) => {
      if (clickEvt.target.tagName === `INPUT`) {
        cardEditComponent.querySelector(`.event__type-toggle`).checked = ``;
        cardEditComponent.querySelector(`.event__type-list`).removeEventListener(`click`, handler);
      }
    };

    flatpickr(cardEditComponent
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
        cardEditComponent.parentNode.replaceChild(cardComponent, cardEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    /**
     * @param {Event} evt
     */
    const onFormSubmit = (evt) => {
      const getOfferData = (data) => {
        let offerData = new Set();

        data.forEach((it) => {
          additionalOffers.find((offer) => offer.id === it).isSelected = true;
          offerData.add(additionalOffers.find((offer) => offer.id === it));
        });

        return offerData;
      };

      evt.preventDefault();

      const formData = new FormData(cardEditComponent.querySelector(`.event--edit`));
      const pathDirectories = cardEditComponent.querySelector(`.event__type-icon`).src.split(`/`);
      const imageName = pathDirectories[pathDirectories.length - 1];
      const entry = {
        type: {
          address: imageName,
          template: cardEditComponent.querySelector(`.event__type-output`).outerText
        },
        city: formData.get(`event-destination`),
        waypointPrice: parseInt(formData.get(`event-price`), 10),
        photos: Array.from(cardEditComponent.querySelectorAll(`.event__photo`)).map((it) => it.src),
        time: {
          duration: {
            days: new Date(new Date(formData.get(`event-end-time`)) - new Date(formData.get(`event-start-time`))).getDate(),
            hours: new Date(new Date(formData.get(`event-end-time`)) - new Date(formData.get(`event-start-time`))).getHours(),
            minutes: new Date(new Date(formData.get(`event-end-time`)) - new Date(formData.get(`event-start-time`))).getMinutes()
          },
          endTime: moment(formData.get(`event-end-time`), `DD/MM/YYYY hh:mm`).valueOf(),
          startTime: moment(formData.get(`event-start-time`), `DD/MM/YYYY hh:mm`).valueOf()
        },
        description: cardEditComponent.querySelector(`.event__destination-description`).textContent,
        offers: getOfferData(formData.getAll(`event-offer`)),
      };

      this._onDataChange(entry, this._data);
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
      cardEditComponent.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          switch (evt.target.value) {
            case `taxi`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/taxi.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`taxi`].template;
              break;

            case `bus`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/bus.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`bus`].template;
              break;

            case `train`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/train.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`train`].template;
              break;

            case `ship`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/ship.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`ship`].template;
              break;

            case `transport`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/transport.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`transport`].template;
              break;

            case `drive`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/drive.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`car`].template;
              break;

            case `flight`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/flight.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`plane`].template;
              break;

            case `check-in`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/check-in.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`hotel`].template;
              break;

            case `sightseeing`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/sightseeing.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`sight`].template;
              break;

            case `restaurant`:
              cardEditComponent.querySelector(`.event__type-icon`).src = `img/icons/restaurant.png`;
              cardEditComponent.querySelector(`.event__type-output`).textContent = waypointType[`restaurant`].template;
              break;
          }
        }
      });
      cardEditComponent.querySelector(`.event--edit`).addEventListener(`submit`, onFormSubmit);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    renderComponent(this._container, cardComponent, `beforeend`);
    cardComponent.querySelector(`.event__rollup-btn`).addEventListener(`click`, onRollupButtonClick);
  }
}

export default PointController;
