import {waypointType} from "./constants";
import moment from "moment";

class ModelPoint {
  constructor(data) {
    this.type = waypointType[data[`type`]];
    this.city = data[`destination`].name;
    this.waypointPrice = data[`base_price`];
    this.description = data[`destination`].description;
    this.photos = data[`destination`].pictures.map((it) => {
      return it;
    });
    this.time = {
      startTime: data[`date_from`],
      endTime: data[`date_to`],
      duration: {
        days: moment.duration(data[`date_to`] - data[`date_from`], `milliseconds`).days(),
        minutes: moment.duration(data[`date_to`] - data[`date_from`], `milliseconds`).minutes(),
        hours: moment.duration(data[`date_to`] - data[`date_from`], `milliseconds`).hours()
      }
    };
    this.id = data[`id`];
    this.offers = data[`offers`].map((it) => {
      return {
        title: it.title,
        price: it.price,
        isSelected: it.accepted,
      };
    });
    this.isFavorite = data[`is_favorite`];
  }

  static parseWaypoint(data) {
    return new ModelPoint(data);
  }

  static parseWaypoints(data) {
    return data.map(ModelPoint.parseWaypoint);
  }
}

export default ModelPoint;
