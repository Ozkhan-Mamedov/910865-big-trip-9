import AbstractComponent from "./abstract-components";
import moment from 'moment';

class Card extends AbstractComponent {
  /**
   * @params { { offers: Set < {} >,
   *             city: string,
   *             time: {
   *               duration: {
   *                 days: string,
   *                 hours: string,
   *                 minutes: string
   *               },
   *               endTime: number,
   *               startTime: number
   *             },
   *             type: {
   *               address: string,
   *               template: string
   *             },
   *             waypointPrice: number } }
   */
  constructor({type, city, waypointPrice, time, offers}) {
    super();
    this._type = type;
    this._city = city;
    this._waypointPrice = waypointPrice;
    this._time = time;
    this._offers = offers;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const getDuration = (startTime, endTime) => {
      const durationObj = moment.duration(new moment(new Date(endTime)).diff(new moment(new Date(startTime))));

      return {
        days: durationObj._data.days,
        hours: durationObj._data.hours,
        minutes: durationObj._data.minutes
      };
    };
    const duration = getDuration(this._time.startTime, this._time.endTime);

    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" src="img/icons/${this._type.address}" alt="Event type icon" width="42" height="42">
          </div>
          <h3 class="event__title">${this._type.template} ${this._city}</h3>
    
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${moment(this._time.startTime).format(`YYYY-MM-DDThh:mm`)}">${moment(this._time.startTime).format(`hh:mm`)}</time>
              —
              <time class="event__end-time" datetime="${moment(this._time.endTime).format(`YYYY-MM-DDThh:mm`)}">${moment(this._time.endTime).format(`hh:mm`)}</time>
            </p>
            <p class="event__duration">${duration.days !== 0 ? duration.days + `D` : ``} ${duration.hours !== 0 ? duration.hours + `H` : ``} ${duration.minutes !== 0 ? duration.minutes + `M` : ``}</p>
          </div>
    
          <p class="event__price">
            €&nbsp;<span class="event__price-value">${this._waypointPrice}</span>
          </p>
    
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
          ${Array.from(this._offers).filter(({isSelected}) => isSelected).map((it, index, arr) => index < arr.length ?
    `
            <li class="event__offer">
              <span class="event__offer-title">${it.title}</span>
              +
              €&nbsp;<span class="event__offer-price">${it.price}</span>
            </li>
           ` : ``).join(``)}
          </ul>
    
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }
}

export default Card;
