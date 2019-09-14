import AbstractComponent from "./abstract-components";
import moment from 'moment';

/**
 * @param { [ {
 *   tripDay: number,
 *   day: number,
 *   month: string,
 *   dayCode: number
 *        } ] } tripDays
 * @return {number}
 */
const getDayNumber = (tripDays) => {
  let counter = 1;
  let tmp = tripDays[0].tripDay;

  tripDays.forEach((it) => {
    if (tmp !== it.tripDay) {
      counter++;
    }

    tmp = it.tripDay;
  });

  return counter;
};

/**
 * @param { [ {
 *   tripDay: number,
 *   day: number,
 *   month: string,
 *   dayCode: number
 *        } ] } tripDays
 * @return {number[]}
 */
const getUniqueTripDays = (tripDays) => {
  let uniqueTripDays = new Set();

  tripDays.forEach((it) => {
    uniqueTripDays.add(it.tripDay);
  });

  return Array.from(uniqueTripDays);
};

class Day extends AbstractComponent {
  constructor(tripDaysData) {
    super();
    this._tripDaysData = tripDaysData;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `
      ${this._tripDaysData.map((it, index) => ((index < getDayNumber(this._tripDaysData))) ? `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${getUniqueTripDays(this._tripDaysData)[index]}</span>
          <time class="day__date" datetime="${moment(it.dayCode).format(`YYYY-MM-DD`)}">${it.month} ${it.day}</time>
        </div>
        <ul class="trip-events__list">
        </ul>
      </li>
      ` : ``).join(``)}
    `;
  }
}

export default Day;
