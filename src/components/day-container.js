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
  const uniqueTripDays = new Set();

  tripDays.forEach((it) => {
    uniqueTripDays.add(it.tripDay);
  });

  return Array.from(uniqueTripDays);
};

class Day extends AbstractComponent {
  /**
   * @param { [ {
   *   tripDay: number,
   *   day: number,
   *   month: string,
   *   dayCode: number
   *        } ] } tripDaysData
   */
  constructor(tripDaysData) {
    super();
    this._tripDaysData = tripDaysData;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const uniqueDays = getUniqueTripDays(this._tripDaysData);

    return `
      ${this._tripDaysData.map((it, index, arr) => ((index < getDayNumber(this._tripDaysData))) ? `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${uniqueDays[index]}</span>
          <time class="day__date" datetime="${moment(arr[arr.findIndex((tripItem) => tripItem.tripDay === uniqueDays[index])].dayCode).format(`YYYY-MM-DD`)}">${arr[arr.findIndex((tripItem) => tripItem.tripDay === uniqueDays[index])].month} ${arr[arr.findIndex((tripItem) => tripItem.tripDay === uniqueDays[index])].day}</time>
        </div>
        <ul class="trip-events__list">
        </ul>
      </li>
      ` : ``).join(``)}
    `;
  }
}

export default Day;
