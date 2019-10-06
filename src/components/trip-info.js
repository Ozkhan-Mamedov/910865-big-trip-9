import {monthsInterpreter} from "../constants";
import AbstractComponent from "./abstract-components";

class TripInfo extends AbstractComponent {
  constructor(waypoints) {
    super();
    this._waypoints = waypoints;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const routePoints = new Set();
    const routeDates = {};

    if (this._waypoints.length) {
      this._waypoints.forEach((it) => {
        routePoints.add(it.city);
      });
      routeDates.startTime = this._waypoints[0].time.startTime;
      routeDates.endTime = this._waypoints[this._waypoints.length - 1].time.startTime;
    }

    if (this._waypoints.length > 0) {
      return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this._waypoints[0].city} — ${(routePoints.size <= 3) ? `${Array.from(routePoints)[1]}` : `...`} — ${this._waypoints[this._waypoints.length - 1].city}</h1>
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

export {
  getTargetMonth,
  TripInfo
};
