import {offersData} from "../constants";
import AbstractComponent from "./abstract-components";
import moment from 'moment';

class CardEdit extends AbstractComponent {
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
   *             photos: [string],
   *             isFavorite: boolean,
   *             id: number }  },
   * @param { [{name: string, description: string, pictures: [ {src: string, description: string} ]}] } cityDescriptionData
   */
  constructor({type, city, waypointPrice, time, description, photos, offers, isFavorite, id}, cityDescriptionData) {
    super();
    this._type = type;
    this._city = city;
    this._waypointPrice = waypointPrice;
    this._time = time;
    this._description = description;
    this._photos = photos;
    this._offers = Array.from(offers);
    this._isFavorite = isFavorite;
    this._id = id;
    this._cityDescriptionData = cityDescriptionData;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const cityList = this._cityDescriptionData.map((it) => {
      return it.name;
    });

    return `
      <form class="trip-events__item event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${this._id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" src="img/icons/${this._type.address}" alt="Event type icon" width="17" height="17">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._id}" type="checkbox">
  
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
  
                <div class="event__type-item">
                  <input id="event-type-taxi-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${this._type.address === `taxi.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-${this._id}">Taxi</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-bus-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${this._type.address === `bus.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-${this._id}">Bus</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-train-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${this._type.address === `train.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--train" for="event-type-train-${this._id}">Train</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-ship-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${this._type.address === `ship.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-${this._id}">Ship</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-transport-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${this._type.address === `transport.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--transport" for="event-type-transport-${this._id}">Transport</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-drive-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${this._type.address === `drive.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-${this._id}">Drive</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-flight-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${this._type.address === `flight.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-${this._id}">Flight</label>
                </div>
              </fieldset>
  
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
  
                <div class="event__type-item">
                  <input id="event-type-check-in-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${this._type.address === `check-in.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-${this._id}">Check-in</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-sightseeing-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${this._type.address === `sightseeing.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-${this._id}">Sightseeing</label>
                </div>
  
                <div class="event__type-item">
                  <input id="event-type-restaurant-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${this._type.address === `restaurant.png` ? `checked=""` : ``}>
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-${this._id}">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>
  
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${this._id}">
              ${this._type.template}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${this._id}" type="text" name="event-destination" value="${this._city}" list="destination-list-${this._id}">
            <datalist id="destination-list-${this._id}">
            ${cityList.map((it, index) => index < cityList.length ? `<option value="${it}"></option>` : ``).join(``)}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${this._id}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${this._id}" type="text" name="event-start-time" value="${moment(this._time.startTime).format(`DD.MM.YY HH:mm`)}">
            —
            <label class="visually-hidden" for="event-end-time-${this._id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${this._id}" type="text" name="event-end-time" value="${moment(this._time.endTime).format(`DD.MM.YY HH:mm`)}">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${this._id}">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-${this._id}" type="number" min="0" name="event-price" value="${this._waypointPrice}">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="button">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
  
          <input id="event-favorite-${this._id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked=""` : ``}>
          
          <label class="event__favorite-btn" for="event-favorite-${this._id}">
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
          
          ${this._offers.map((it, index) => index < this._offers.length ? `
          <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offersData.find((it1) => it1.name === it.title).id}-${this._id}" type="checkbox" name="${offersData.find((it1) => it1.name === it.title).id}" ${it.isSelected ? `checked=""` : ``}>
              <label class="event__offer-label" for="event-offer-${offersData.find((it1) => it1.name === it.title).id}-${this._id}">
                <span class="event__offer-title">${it.title}</span>
                +
                €&nbsp;<span class="event__offer-price">${it.price}</span>
              </label>
            </div>
          ` : ``).join(``)}
          
        </section>
          
          
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${this._description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${this._photos.map((it, index)=> index < this._photos.length ? `<img class="event__photo" src="${it.src}" alt="${it.description}">` : ``).join(``)}
        </div>
      </div>
    </section>
        </section>
      </form>
    `;
  }
}

export default CardEdit;
