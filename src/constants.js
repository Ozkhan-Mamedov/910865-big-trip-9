const MIN_SENTENCE_NUMBER = 1;
const MAX_SENTENCE_NUMBER = 3;
const MAX_PHOTOS_NUMBER = 8;
const WAYPOINTS_NUMBER = 9;
const DAYS_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MSECONDS_IN_SECOND = 1000;
const MIN_TIME_RANGE = 0;
const MAX_TIME_RANGE = 100000000;
const MIN_PRICE_RANGE = 15;
const MAX_PRICE_RANGE = 500;
const MAX_OFFERS_RANGE = 2;
const monthsInterpreter = {
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
const cities = [
  `Venice`,
  `Budapest`,
  `Paris`,
  `Brugge`,
  `Amsterdam`,
  `Athens`,
  `Sydney`
];
const waypointTypeNames = [
  `bus`,
  `check-in`,
  `drive`,
  `flight`,
  `restaurant`,
  `ship`,
  `sightseeing`,
  `taxi`,
  `train`,
  `transport`
];
const waypointTransportTypeNames = [
  `bus`,
  `drive`,
  `flight`,
  `ship`,
  `taxi`,
  `train`,
  `transport`
];
const waypointType = {
  'bus': {
    address: `bus.png`,
    template: `Bus to`,
  },
  'check-in': {
    address: `check-in.png`,
    template: `Check in`,
  },
  'drive': {
    address: `drive.png`,
    template: `Drive to`,
  },
  'flight': {
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
  'sightseeing': {
    address: `sightseeing.png`,
    template: `Sightseeing at`,
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
const offersData = [
  {
    id: `radio`,
    name: `Choose the radio station`
  },
  {
    id: `temperature`,
    name: `Choose temperature`
  },
  {
    id: `drive-quickly`,
    name: `Drive quickly, I'm in a hurry`
  },
  {
    id: `drive-slowly`,
    name: `Drive slowly`
  },
  {
    id: `infotainment-system`,
    name: `Infotainment system`
  },
  {
    id: `order-meal`,
    name: `Order meal`
  },
  {
    id: `seats`,
    name: `Choose seats`
  },
  {
    id: `book-taxi`,
    name: `Book a taxi at the arrival point`
  },
  {
    id: `order-breakfast`,
    name: `Order a breakfast`
  },
  {
    id: `wake-at-certain-time`,
    name: `Wake up at a certain time`
  },
  {
    id: `meal`,
    name: `Choose meal`
  },
  {
    id: `upgrade-to-comfort-class`,
    name: `Upgrade to comfort class`
  },
  {
    id: `upgrade-to-business-class`,
    name: `Upgrade to business class`
  },
  {
    id: `upgrade-to-business-class`,
    name: `Upgrade to a business class`
  },
  {
    id: `add-luggage`,
    name: `Add luggage`
  },
  {
    id: `business-lounge`,
    name: `Business lounge`
  },
  {
    id: `check-in-time`,
    name: `Choose the time of check-in`
  },
  {
    id: `check-out-time`,
    name: `Choose the time of check-out`
  },
  {
    id: `add-breakfast`,
    name: `Add breakfast`
  },
  {
    id: `laundry`,
    name: `Laundry`
  },
  {
    id: `order-meal-from-restaurant`,
    name: `Order a meal from the restaurant`
  },
  {
    id: `comfort-class`,
    name: `Choose comfort class`
  },
  {
    id: `business-class`,
    name: `Choose business class`
  },
  {
    id: `live-music`,
    name: `Choose live music`
  },
  {
    id: `vip-area`,
    name: `Choose VIP area`
  },
];
const additionalOffers = [
  {
    id: `luggage`,
    title: `Add luggage`,
    price: 30,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    id: `meal`,
    title: `Add meal`,
    price: 15,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    id: `seats`,
    title: `Choose seats`,
    price: 5,
    isSelected: Boolean(Math.round(Math.random())),
  },
  {
    id: `train`,
    title: `Travel by train`,
    price: 40,
    isSelected: Boolean(Math.round(Math.random())),
  }
];
const TripControllerMode = {
  ADDING: `adding`,
  DEFAULT: `default`
};
const MAX_OFFER_NUMBER = 3;

export {
  MIN_SENTENCE_NUMBER,
  MAX_SENTENCE_NUMBER,
  MAX_PHOTOS_NUMBER,
  WAYPOINTS_NUMBER,
  DAYS_IN_WEEK,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE,
  MSECONDS_IN_SECOND,
  MIN_TIME_RANGE,
  MAX_TIME_RANGE,
  MIN_PRICE_RANGE,
  MAX_PRICE_RANGE,
  MAX_OFFERS_RANGE,
  monthsInterpreter,
  waypointType,
  waypointTypeNames,
  additionalOffers,
  cities,
  TripControllerMode,
  waypointTransportTypeNames,
  offersData,
  MAX_OFFER_NUMBER
};
