import {getTargetMonth, TripInfo} from "../components/trip-info";

class TripInfoController {
  constructor(waypoints) {
    this._waypoints = waypoints;
    this._tripInfo = new TripInfo(this._waypoints).getElement();
  }

  updateTripInfo(waypoints) {
    const tripCostValue = document.querySelector(`.trip-info__cost-value`);
    const tripTitle = document.querySelector(`.trip-info__title`);
    const tripDates = document.querySelector(`.trip-info__dates`);
    let routePoints = new Set();
    let routeDates = {};

    if (this._waypoints.length) {
      this._waypoints.forEach((it) => {
        routePoints.add(it.city);
      });
      routeDates.startTime = this._waypoints[0].time.startTime;
      routeDates.endTime = this._waypoints[this._waypoints.length - 1].time.startTime;
    }

    tripCostValue.textContent = this._getTripCostValue(waypoints);
    if (this._waypoints.length) {
      tripTitle.textContent = `${this._waypoints[0].city} — ${(routePoints.size <= 3) ? `${Array.from(routePoints)[1]}` : `...`} — ${this._waypoints[this._waypoints.length - 1].city}`;
      tripDates.textContent = `${getTargetMonth(new Date(routeDates.startTime).getMonth())} ${new Date(routeDates.startTime).getDate()} — ${(getTargetMonth(new Date(routeDates.startTime).getMonth()) !== getTargetMonth(new Date(routeDates.endTime).getMonth())) ? getTargetMonth(new Date(routeDates.endTime).getMonth()) : ``} ${new Date(routeDates.endTime).getDate()}`;
    } else {
      tripTitle.textContent = ``;
      tripDates.textContent = ``;
    }
    /*tripTitle.textContent = `${this._waypoints[0].city} — ${(routePoints.size <= 3) ? `${Array.from(routePoints)[1]}` : `...`} — ${this._waypoints[this._waypoints.length - 1].city}`;
    tripDates.textContent = `${getTargetMonth(new Date(routeDates.startTime).getMonth())} ${new Date(routeDates.startTime).getDate()} — ${(getTargetMonth(new Date(routeDates.startTime).getMonth()) !== getTargetMonth(new Date(routeDates.endTime).getMonth())) ? getTargetMonth(new Date(routeDates.endTime).getMonth()) : ``} ${new Date(routeDates.endTime).getDate()}`;*/
  }

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
   *             photos: [string],
   *             isFavorite: boolean } ] } waypoints
   * @return {number}
   */
  _getTripCostValue(waypoints) {
    let sum = 0;
    const mainContainer = document.querySelector(`.trip-events`);
    const additionalOffersPrice = mainContainer.querySelectorAll(`.event__offer-price`);

    waypoints.forEach((it) => {
      sum += it.waypointPrice;
    });

    additionalOffersPrice.forEach((it) => {
      sum += parseInt(it.textContent, 10);
    });

    return sum;
  }
}

export default TripInfoController;
