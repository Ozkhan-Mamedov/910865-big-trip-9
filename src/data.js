import {getRandomNumber} from "./utils";
import {
  MIN_SENTENCE_NUMBER, MAX_SENTENCE_NUMBER, MAX_PHOTOS_NUMBER,
  WAYPOINTS_NUMBER, HOURS_IN_DAY, MINUTES_IN_HOUR, SECONDS_IN_MINUTE,
  MSECONDS_IN_SECOND, MAX_TIME_RANGE, MIN_TIME_RANGE, DAYS_IN_WEEK,
  MIN_PRICE_RANGE, MAX_PRICE_RANGE, MAX_OFFERS_RANGE, waypointType, additionalOffers,
  cities, waypointTypeNames
} from "./constants";
import moment from "moment";

const description = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`];

/**
 * @return { { address : string,
 *             template : string } }
 */
const getRandomType = () => {
  return waypointType[waypointTypeNames[getRandomNumber(0, waypointTypeNames.length - 1)]];
};

/**
 * @return {number}
 */
const getWaypointPrice = () => {
  return getRandomNumber(MIN_PRICE_RANGE, MAX_PRICE_RANGE);
};

/**
 * @return {Set<{ title : string,
 *                price : number,
 *                isSelected : boolean }>}
 */
const getOffers = () => {
  const offers = new Set();
  const elemIndex = getRandomNumber(0, MAX_OFFERS_RANGE);

  for (let i = 0; i < elemIndex; i++) {
    const elem = additionalOffers[getRandomNumber(0, additionalOffers.length - 1)];

    if (elem.isSelected === true) {
      offers.add(elem);
    }
  }

  return offers;
};

/**
 * @return { [string] }
 */
const getWaypointPhotos = () => {
  const photos = [];
  const photosNumber = getRandomNumber(0, MAX_PHOTOS_NUMBER);

  for (let i = 0; i < photosNumber; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return photos;
};

/**
 * @param { [string] } descriptions
 * @return { string }
 */
const getWaypointDescription = (descriptions) => {
  let waypointDescription = ``;
  const sentence = getRandomNumber(MIN_SENTENCE_NUMBER, MAX_SENTENCE_NUMBER);

  for (let i = 0; i < sentence; i++) {
    waypointDescription += `${descriptions[getRandomNumber(0, descriptions.length - 1)]} `;
  }

  return waypointDescription;
};

/**
 * @return { {startTime: number,
 *            endTime: number,
 *            duration: {
 *              minutes: number,
 *              hours: number,
 *              days: number }
 *            } }
 */
const getTime = () => {
  const randomDate = Date.now() + getRandomNumber(0, DAYS_IN_WEEK) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MSECONDS_IN_SECOND;
  const startTime = randomDate - getRandomNumber(MIN_TIME_RANGE, MAX_TIME_RANGE);
  const endTime = randomDate + getRandomNumber(MIN_TIME_RANGE, MAX_TIME_RANGE);
  const diff = moment.duration(endTime - startTime, `milliseconds`);
  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();

  return {
    startTime,
    endTime,
    duration: {
      minutes,
      hours,
      days
    }
  };
};

/**
 * @return { { offers: Set < {} >,
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
 *             isFavorite: boolean } }
 */
const getWaypoint = () => ({
  type: getRandomType(),
  city: cities[getRandomNumber(0, cities.length - 1)],
  waypointPrice: getWaypointPrice(),
  time: getTime(),
  description: getWaypointDescription(description),
  photos: getWaypointPhotos(),
  offers: getOffers(),
  isFavorite: Math.random() >= 0.5
});

/**
 * @param { { time: {
 *                    duration: {
 *                      days: number,
 *                      hours: number,
 *                      minutes: number
 *                    },
 *                    startTime: number,
 *                    endTime: number } } } a
 * @param { { time: {
 *                    duration: {
 *                      days: number,
 *                      hours: number,
 *                      minutes: number
 *                    },
 *                    startTime: number,
 *                    endTime: number } } } b
 * @return {number}
 */
const getSortedByDateList = (a, b) => {
  return a.time.startTime - b.time.startTime;
};

const waypoints = Array(WAYPOINTS_NUMBER);
const menus = [
  `Table`,
  `Stats`,
];
const filters = [
  `everything`,
  `future`,
  `past`,
];

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints[i] = getWaypoint();
}

export {
  cities,
  menus,
  filters,
  getSortedByDateList
};
