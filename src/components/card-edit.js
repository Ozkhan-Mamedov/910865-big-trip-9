import {cities} from "../data";
import AbstractComponent from "./abstract-components";
import moment from 'moment';

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
 *             photos: [string] }] } arr
 * @param {string} name
 * @return {boolean}
 */
const getOffersStatus = (arr, name) => {
  let isSelected = false;
  let elem;

  switch (name) {
    case `luggage`:
      elem = arr.slice().filter((it) => it.id === `luggage`)[0];

      if (elem) {
        isSelected = elem.isSelected;
      }
      break;

    case `comfort`:
      elem = arr.slice().filter((it) => it.id === `comfort`)[0];

      if (elem) {
        isSelected = elem.isSelected;
      }
      break;

    case `meal`:
      elem = arr.slice().filter((it) => it.id === `meal`)[0];

      if (elem) {
        isSelected = elem.isSelected;
      }
      break;

    case `seats`:
      elem = arr.slice().filter((it) => it.id === `seats`)[0];

      if (elem) {
        isSelected = elem.isSelected;
      }
      break;

    case `train`:
      elem = arr.slice().filter((it) => it.id === `train`)[0];

      if (elem) {
        isSelected = elem.isSelected;
      }
      break;
  }

  return isSelected;
};

class CardEdit extends AbstractComponent {
  /**
   * @params { { offers: Set < {} >,
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
   *             photos: [string] }  }
   */
  constructor({type, city, waypointPrice, time, description, photos, offers}) {
    super();
    this._type = type;
    this._city = city;
    this._waypointPrice = waypointPrice;
    this._time = time;
    this._description = description;
    this._photos = photos;
    this._offers = Array.from(offers);
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" src="img/icons/${this._type.address}" alt="Event type icon" width="17" height="17">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
  
                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${this._type.address === `taxi.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${this._type.address === `bus.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${this._type.address === `train.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${this._type.address === `ship.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${this._type.address === `transport.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${this._type.address === `drive.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${this._type.address === `flight.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>
              </fieldset>
  
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
  
                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${this._type.address === `check-in.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${this._type.address === `sightseeing.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${this._type.address === `restaurant.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>
  
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${this._type.template}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${cities.map((it, index) => index < cities.length ? `<option value="${it}"></option>` : ``).join(``)}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._time.startTime).format(`DD/MM/YY HH:mm`)}">
            —
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._time.endTime).format(`DD/MM/YY HH:mm`)}">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._waypointPrice}">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
  
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked="">
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </label>
  
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
  
        <section class="event__details">
  
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer" value="luggage" ${getOffersStatus(this._offers, `luggage`) ? `checked=""` : ``}>
                <label class="event__offer-label" for="event-offer-luggage-1">
                  <span class="event__offer-title">Add luggage</span>
                  +
                  €&nbsp;<span class="event__offer-price">30</span>
                </label>
              </div>
  
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer" value="comfort" ${getOffersStatus(this._offers, `comfort`) ? `checked=""` : ``}>
                <label class="event__offer-label" for="event-offer-comfort-1">
                  <span class="event__offer-title">Switch to comfort class</span>
                  +
                  €&nbsp;<span class="event__offer-price">100</span>
                </label>
              </div>
  
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer" value="meal" ${getOffersStatus(this._offers, `meal`) ? `checked=""` : ``}>
                <label class="event__offer-label" for="event-offer-meal-1">
                  <span class="event__offer-title">Add meal</span>
                  +
                  €&nbsp;<span class="event__offer-price">15</span>
                </label>
              </div>
  
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer" value="seats" ${getOffersStatus(this._offers, `seats`) ? `checked=""` : ``}>
                <label class="event__offer-label" for="event-offer-seats-1">
                  <span class="event__offer-title">Choose seats</span>
                  +
                  €&nbsp;<span class="event__offer-price">5</span>
                </label>
              </div>
  
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer" value="train" ${getOffersStatus(this._offers, `train`) ? `checked=""` : ``}>
                <label class="event__offer-label" for="event-offer-train-1">
                  <span class="event__offer-title">Travel by train</span>
                  +
                  €&nbsp;<span class="event__offer-price">40</span>
                </label>
              </div>
            </div>
          </section>
  
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${this._description}</p>
  
            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${this._photos.map((it, index)=> index < this._photos.length ? `<img class="event__photo" src="${it}" alt="Event photo">` : ``).join(``)}
              </div>
            </div>
          </section>
        </section>
      </form>
    `;
  }
}

export default CardEdit;
