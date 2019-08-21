import {sortedWaypoints} from "../data";
import {monthsInterpreter} from "../constants";

let routePoints = new Set();
let routeDates = {};

/**
 * @return {string}
 */
export const getTripInfoComponent = () => {
  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${sortedWaypoints[0].city} — ${(routePoints.size <= 3) ? `${Array.from(routePoints)[1]}` : `...`} — ${sortedWaypoints[sortedWaypoints.length - 1].city}</h1>
      <p class="trip-info__dates">${getTargetMonth(new Date(routeDates.startTime).getMonth())} ${new Date(routeDates.startTime).getDate()}&nbsp;—${(getTargetMonth(new Date(routeDates.startTime).getMonth()) !== getTargetMonth(new Date(routeDates.endTime).getMonth())) ? getTargetMonth(new Date(routeDates.endTime).getMonth()) : ``} ${new Date(routeDates.endTime).getDate()}</p>
    </div>
  `;
};

/**
 * @param {number} month
 * @return {String}
 */
export const getTargetMonth = (month) => {
  let resultMonth;

  for (let key in monthsInterpreter) {
    if (key === month.toString()) {
      resultMonth = monthsInterpreter[key];
    }
  }

  return resultMonth;
};

sortedWaypoints.forEach((it) => {
  routePoints.add(it.city);
});
routeDates.startTime = sortedWaypoints[0].time.startTime;
routeDates.endTime = sortedWaypoints[sortedWaypoints.length - 1].time.startTime;
