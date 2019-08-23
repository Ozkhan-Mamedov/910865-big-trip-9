import {sortedWaypoints} from "../data";
import {monthsInterpreter} from "../constants";
import {createElement} from "../utils";

let routePoints = new Set();
let routeDates = {};

class TripInfo {
  constructor() {
    this._element = null;
  }

  /**
   * @return {null | Node}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    if (sortedWaypoints.length > 0) {
      return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${sortedWaypoints[0].city} — ${(routePoints.size <= 3) ? `${Array.from(routePoints)[1]}` : `...`} — ${sortedWaypoints[sortedWaypoints.length - 1].city}</h1>
        <p class="trip-info__dates">${getTargetMonth(new Date(routeDates.startTime).getMonth())} ${new Date(routeDates.startTime).getDate()}&nbsp;— ${(getTargetMonth(new Date(routeDates.startTime).getMonth()) !== getTargetMonth(new Date(routeDates.endTime).getMonth())) ? getTargetMonth(new Date(routeDates.endTime).getMonth()) : ``} ${new Date(routeDates.endTime).getDate()}</p>
      </div>
    `;
    } else {
      return ``;
    }
  }
}

/**
 * @param {number} month
 * @return {String}
 */
const getTargetMonth = (month) => {
  let resultMonth;

  for (let key in monthsInterpreter) {
    if (key === month.toString()) {
      resultMonth = monthsInterpreter[key];
    }
  }

  return resultMonth;
};

if (sortedWaypoints.length) {
  sortedWaypoints.forEach((it) => {
    routePoints.add(it.city);
  });
  routeDates.startTime = sortedWaypoints[0].time.startTime;
  routeDates.endTime = sortedWaypoints[sortedWaypoints.length - 1].time.startTime;
}

export {
  getTargetMonth,
  TripInfo
};
