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
 * @return {string}
 */
export const getCardComponent = ({type, city, waypointPrice, time, offers}) => {
  return `
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" src="img/icons/${type.address}" alt="Event type icon" width="42" height="42">
        </div>
        <h3 class="event__title">${type.template} ${city}</h3>
  
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${new Date(time.startTime).toISOString().substr(0, 16)}">${new Date(time.startTime).toTimeString().substr(0, 5)}</time>
            —
            <time class="event__end-time" datetime="${new Date(time.endTime).toISOString().substr(0, 16)}">${new Date(time.endTime).toTimeString().substr(0, 5)}</time>
          </p>
          <p class="event__duration">${time.duration.days !== `00` ? time.duration.days + `D` : ``} ${time.duration.hours !== `00` ? time.duration.hours + `H` : ``} ${time.duration.minutes !== `00` ? time.duration.minutes + `M` : ``}</p>
        </div>
  
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${waypointPrice}</span>
        </p>
  
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${Array.from(offers).filter(({isSelected}) => isSelected).map((it, index, arr) => index < arr.length ?
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
};
