import {getRandomNumber} from "./utils";
import {MIN_SENTENCE_NUMBER, MAX_SENTENCE_NUMBER, MAX_PHOTOS_NUMBER,
  WAYPOINTS_NUMBER, CURRENT_YEAR, MONTHS_IN_YEAR, DAYS_IN_MONTH,
  HOURS_IN_DAY, MINUTES_IN_HOUR, SECONDS_IN_MINUTE, MSECONDS_IN_SECOND} from "./constants";

const waypointType = {
  'bus': {
    address: `bus.png`,
    template: `Bus to`,
  },
  'hotel': {
    address: `check-in.png`,
    template: `Check into hotel`,
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
    template: `Sightseeing`,
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
const waypointPrice = getRandomNumber(15, 1000);
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

const getOffers = () => {
  let offers = new Set();
  let elemIndex = getRandomNumber(0, 2);

  for (let i = 0; i < elemIndex; i++) {
    offers.add(additionalOffers[getRandomNumber(0, 5)]);
  }

  return offers;
};

const getWaypointPhotos = () => {
  let photos = [];
  const photosNumber = getRandomNumber(0, MAX_PHOTOS_NUMBER);

  for (let i = 0; i < photosNumber; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return photos;
};

const getWaypointDescription = (descriptions) => {
  let waypointDescription = ``;
  const sentence = getRandomNumber(MIN_SENTENCE_NUMBER, MAX_SENTENCE_NUMBER);

  for (let i = 0; i < sentence; i++) {
    waypointDescription += `${descriptions[getRandomNumber(0, descriptions.length - 1)]} `;
  }

  return waypointDescription;
};

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

const getStartTime = () => {
  return Date.now() - getRandomNumber(0, 2) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MSECONDS_IN_SECOND + 2 * 60 * 60 * 1000;
};

const getEndTime = () => {
  return Date.now() + getRandomNumber(0, 2) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MSECONDS_IN_SECOND + 20 * 60 * 1000;
};

const getDuration = (start, end) => {
  let minutes = Math.abs(new Date(end).getMinutes() - new Date(start).getMinutes());
  let hours = Math.abs(new Date(end).getHours() - new Date(start).getHours());
  let days = Math.abs(new Date(end).getDay() - new Date(start).getDay());

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
    minutes,
    hours,
    days
  };
};

const getWaypoint = () => ({
  type: waypointType[waypointTypeNames[getRandomNumber(0, waypointTypeNames.length - 1)]].address,
  cities: cities[getRandomNumber(0, cities.length - 1)],
  waypointPrice,
  startTime: getStartTime(),
  endTime: getEndTime(),
  duration: getDuration(getStartTime(), getEndTime()),
  description: getWaypointDescription(description),
  photos: getWaypointPhotos(),
  offers: getOffers(),
});

export const waypoints = Array(WAYPOINTS_NUMBER);

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints[i] = getWaypoint();
}

console.log(getWaypoint());
console.log(getWaypoint());
console.log(getWaypoint());
console.log(waypoints);

