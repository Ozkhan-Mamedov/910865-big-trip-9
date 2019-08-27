import {sortedWaypoints} from "../data";
import {getTargetMonth} from "./trip-info";
import AbstractComponent from "./abstract-components";

/**
 * @return {number}
 */
const getDayNumber = () => {
  let counter = 1;
  let tmp = tripDaysData[0].tripDay;

  tripDaysData.forEach((it) => {
    if (tmp !== it.tripDay) {
      counter++;
    }

    tmp = it.tripDay;
  });

  return counter;
};

/**
 * @return { [ {
 *   tripDay: number,
 *   day: number,
 *   month: string,
 *   dayCode: number
 *        } ] }
 */
const getDaysData = () => {
  let dates = [];

  if (sortedWaypoints.length) {
    let currentTripDay = 1;
    let oldStateDate = new Date(sortedWaypoints[0].time.startTime).getDate();
    let oldStateMonth = new Date(sortedWaypoints[0].time.startTime).getMonth();

    sortedWaypoints.forEach((it) => {
      if ((new Date(it.time.startTime).getDate() !== oldStateDate) || (new Date(it.time.startTime).getMonth() !== oldStateMonth)) {
        currentTripDay++;
      }

      dates.push({
        tripDay: currentTripDay,
        day: new Date(it.time.startTime).getDate(),
        month: getTargetMonth(new Date(it.time.startTime).getMonth()),
        dayCode: it.time.startTime
      });
      oldStateDate = new Date(it.time.startTime).getDate();
      oldStateMonth = new Date(it.time.startTime).getMonth();
    });
  }
  return dates;
};

/**
 * @return {number[]}
 */
const getUniqueTripDays = () => {
  let uniqueTripDays = new Set();

  tripDaysData.forEach((it) => {
    uniqueTripDays.add(it.tripDay);
  });

  return Array.from(uniqueTripDays);
};

class Day extends AbstractComponent {
  constructor() {
    super();
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `
      ${tripDaysData.map((it, index) => ((index < getDayNumber())) ? `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${getUniqueTripDays()[index]}</span>
          <time class="day__date" datetime="${new Date(it.dayCode).toISOString().substr(0, 10)}">${it.month} ${it.day}</time>
        </div>
        <ul class="trip-events__list">
        </ul>
      </li>
      ` : ``).join(``)}
    `;
  }
}

const tripDaysData = getDaysData();

export {
  getDayNumber,
  Day,
  tripDaysData
};
