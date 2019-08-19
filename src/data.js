import {getRandomNumber} from "./utils";
import {
  MIN_SENTENCE_NUMBER, MAX_SENTENCE_NUMBER, MAX_PHOTOS_NUMBER,
  WAYPOINTS_NUMBER, HOURS_IN_DAY, MINUTES_IN_HOUR, SECONDS_IN_MINUTE,
  MSECONDS_IN_SECOND, MAX_TIME_RANGE, MIN_TIME_RANGE, DAYS_IN_WEEK,
  MIN_PRICE_RANGE, MAX_PRICE_RANGE, MAX_OFFERS_RANGE
} from "./constants";

const waypointType = {
  'bus': {
    address: `bus.png`,
    template: `Bus to`,
  },
  'hotel': {
    address: `check-in.png`,
    template: `Check into hotel in`,
  },
  'car': {
    address: `drive.png`,
    template: `Drive to`,
  },
  'plane': {
    address: `flight.png`,
    template: `Flight to`,
  },
  'restaurant': {
    address: `restaurant.png`,
    template: `Eat at`,
  },
  'ship': {
    address: `ship.png`,
    template: `Ship to`,
  },
  'sight': {
    address: `sightseeing.png`,
    template: `Sightseeing in`,
  },
  'taxi': {
    address: `taxi.png`,
    template: `Taxi to`,
  },
  'train': {
    address: `train.png`,
    template: `Train to`,
  },
  'transport': {
    address: `transport.png`,
    template: `Transport to`,
  },
};
const waypointTypeNames = [
  `bus`,
  `hotel`,
  `car`,
  `plane`,
  `restaurant`,
  `ship`,
  `sight`,
  `taxi`,
  `train`,
  `transport`
];
const cities = [
  `Venice`,
  `Budapest`,
  `Paris`,
  `Brugge`,
  `Amsterdam`,
  `Athens`,
  `Sydney`
];
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
const additionalOffers = [
  {
    title: `Add luggage`,
    price: 30,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    title: `Switch to comfort class`,
    price: 100,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    title: `Add meal`,
    price: 15,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    title: `Choose seats`,
    price: 5,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    title: `Travel by train`,
    price: 40,
    isSelected: Boolean(Math.round(Math.random())),
  }
];
const months = {
  '0': `jan`,
  '1': `feb`,
  '2': `mar`,
  '3': `apr`,
  '4': `may`,
  '5': `jun`,
  '6': `jul`,
  '7': `aug`,
  '8': `sep`,
  '9': `oct`,
  '10': `nov`,
  '11': `dec`,
};

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
  let offers = new Set();
  let elemIndex = getRandomNumber(0, MAX_OFFERS_RANGE);

  for (let i = 0; i < elemIndex; i++) {
    offers.add(additionalOffers[getRandomNumber(0, additionalOffers.length - 1)]);
  }

  return offers;
};

/**
 * @return { [string] }
 */
const getWaypointPhotos = () => {
  let photos = [];
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
 * @return { {duration: {hours: string, minutes: string, days: string},
 *            startTime: number,
 *            endTime: number} }
 */
const getTime = () => {
  const randomDate = Date.now() + getRandomNumber(0, DAYS_IN_WEEK - 1) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MSECONDS_IN_SECOND;
  const startTime = randomDate - getRandomNumber(MIN_TIME_RANGE, MAX_TIME_RANGE);
  const endTime = randomDate + getRandomNumber(MIN_TIME_RANGE, MAX_TIME_RANGE);
  const diff = Math.abs(endTime - startTime);

  let minutes = Math.floor((diff / MSECONDS_IN_SECOND) / SECONDS_IN_MINUTE) % SECONDS_IN_MINUTE;
  let hours = Math.floor(diff / MSECONDS_IN_SECOND / SECONDS_IN_MINUTE / MINUTES_IN_HOUR) % HOURS_IN_DAY;
  let days = Math.floor((diff / 3600000) / HOURS_IN_DAY);

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (days < 10) {
    days = `0${days}`;
  }

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
 *             waypointPrice: number,
 *             photos: [string] } }
 */
const getWaypoint = () => ({
  type: getRandomType(),
  city: cities[getRandomNumber(0, cities.length - 1)],
  waypointPrice: getWaypointPrice(),
  time: getTime(),
  description: getWaypointDescription(description),
  photos: getWaypointPhotos(),
  offers: getOffers(),
});

export const waypoints = Array(WAYPOINTS_NUMBER);
export const menus = [
  `Table`,
  `Stats`,
];
export const filters = [
  `everything`,
  `future`,
  `past`,
];

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints[i] = getWaypoint();
}

console.log(getWaypoint());
console.log(getWaypoint());
console.log(getWaypoint());
console.log(waypoints);
