import {getRandomNumber, Position, renderComponent, unrenderComponent, getDaysData} from "../utils";
import {getSortedByDateList} from "../data";
import CardBoard from "../components/card-board";
import Day from "../components/day-container";
import Sort from "../components/sort";
import PointController from "./point-controller";
import Statistics from "../components/statistics";
import {cities, TripControllerMode, waypointType, waypointTypeNames,
  MSECONDS_IN_SECOND, SECONDS_IN_MINUTE, MINUTES_IN_HOUR, waypointTransportTypeNames} from "../constants";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

class TripController {
  /**
   * @param {Element} container
   * @param { [{duration: {hours: number, minutes: number, days: number},
   *            startTime: number,
   *            endTime: number}] } waypoints
   * @param { [ {
   *   tripDay: number,
   *   day: number,
   *   month: string,
   *   dayCode: number
   *        } ] } tripDaysData
   */
  constructor(container, waypoints, tripDaysData) {
    this._container = container;
    this._waypoints = waypoints;
    this._tripDaysData = tripDaysData;
    this._eventContainerIndex = 0;
    this._board = new CardBoard();
    this._sort = new Sort();
    this._dayElement = new Day(tripDaysData).getElement();
    this._subscriptions = [];
    this._creatingWaypoint = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  init() {
    renderComponent(this._container, this._sort.getElement(), Position.BEFOREEND);
    renderComponent(this._container, this._board.getElement(), Position.BEFOREEND);
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, Position.BEFOREEND);
    renderComponent(this._container, new Statistics().getElement(), Position.BEFOREEND);

    this._waypoints.forEach((it, dayIndex) => {
      if ((dayIndex > 0) && (this._tripDaysData[dayIndex].tripDay !== this._tripDaysData[dayIndex - 1].tripDay)) {
        this._eventContainerIndex++;
      }

      this._renderTripWaypoint(it, this._eventContainerIndex);
    });

    this._sort.getElement().querySelector(`.trip-sort`).addEventListener(`click`, (evt) => this._onSortElementClick(evt));
  }

  unrenderTripBoard() {
    this._container.innerHTML = ``;
  }

  /**
   * @param {{duration: {hours: number, minutes: number, days: number},
   *            startTime: number,
   *            endTime: number}} tripWaypoint
   * @param {number} containerIndex
   * @private
   */
  _renderTripWaypoint(tripWaypoint, containerIndex) {
    const pointController = new PointController(this._dayElement.querySelectorAll(`.trip-events__list`)[containerIndex], tripWaypoint, TripControllerMode.DEFAULT, this._onDataChange, this._onChangeView);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _createTripWaypoint() {
    if (this._creatingWaypoint !== null) {
      return;
    }

    const defaultWaypoint = {
      type: waypointType[waypointTypeNames[getRandomNumber(0, waypointTypeNames.length - 1)]],
      city: cities[getRandomNumber(0, cities.length - 1)],
      waypointPrice: 0,
      time: {
        startTime: new Date(),
        endTime: new Date(),
      },
      offers: new Set(),
    };

    this._creatingWaypoint = new PointController(this._board.getElement().firstElementChild, defaultWaypoint, TripControllerMode.ADDING, this._onDataChange, this._onChangeView);
    this._creatingWaypoint = null;
  }

  /**
   * @param { { offers: Set < {} >,
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
   *             photos: [string] } } newData
   * @param { { offers: Set < {} >,
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
   *             photos: [string] } } oldData
   * @private
   */
  _onDataChange(newData, oldData) {
    if (oldData !== null && newData !== null) {
      this._waypoints[this._waypoints.findIndex((it) => it === oldData)] = newData;
    }
    if (newData === null) {
      this._waypoints.splice(this._waypoints.findIndex((it) => it === newData), 1);
    }
    if (oldData === null) {
      this._waypoints.unshift(newData);
      this._waypoints.sort(getSortedByDateList);
      this._tripDaysData = getDaysData(this._waypoints);
    }
    unrenderComponent(this._board.getElement());
    this._board = new CardBoard();
    renderComponent(this._container, this._board.getElement(), Position.BEFOREEND);
    this._dayElement = new Day(this._tripDaysData).getElement();
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, Position.BEFOREEND);
    this._eventContainerIndex = 0;
    this._waypoints.forEach((it, dayIndex) => {
      if ((dayIndex > 0) && (this._tripDaysData[dayIndex].tripDay !== this._tripDaysData[dayIndex - 1].tripDay)) {
        this._eventContainerIndex++;
      }
      this._renderTripWaypoint(it, this._eventContainerIndex);
    });
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  /**
   * @param {Event} evt
   * @private
   */
  _onSortElementClick(evt) {
    const clearDaysData = () => {
      document.querySelectorAll(`.day__counter`).forEach((it) => {
        unrenderComponent(it);
      });
      document.querySelectorAll(`.day__date`).forEach((it) => {
        unrenderComponent(it);
      });
    };

    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    unrenderComponent(this._board.getElement());
    this._board = new CardBoard();
    renderComponent(this._container, this._board.getElement(), Position.BEFOREEND);
    this._dayElement = new Day(this._tripDaysData).getElement();
    this._eventContainerIndex = 0;
    renderComponent(this._board.getElement().firstElementChild, this._dayElement, Position.BEFOREEND);

    switch (evt.target.dataset.sortType) {
      case `event`:
        this._waypoints.forEach((it, index) => {
          if ((index > 0) && (this._tripDaysData[index].tripDay !== this._tripDaysData[index - 1].tripDay)) {
            this._eventContainerIndex++;
          }
          this._renderTripWaypoint(it, this._eventContainerIndex);
        });
        break;

      case `time`:
        this._waypoints.slice()
          .sort((a, b) => (parseInt(a.time.duration.days, 10) - parseInt(b.time.duration.days, 10)) || (parseInt(a.time.duration.hours, 10) - parseInt(b.time.duration.hours, 10)) || (parseInt(a.time.duration.minutes, 10) - parseInt(b.time.duration.minutes, 10)))
          .forEach((it, index) => {
            if ((index > 0) && (this._tripDaysData[index].tripDay !== this._tripDaysData[index - 1].tripDay)) {
              this._eventContainerIndex++;
            }
            this._renderTripWaypoint(it, this._eventContainerIndex);
          });
        clearDaysData();
        break;

      case `price`:
        this._waypoints.slice().sort((a, b) => a.waypointPrice - b.waypointPrice).forEach((it, index) => {
          if ((index > 0) && (this._tripDaysData[index].tripDay !== this._tripDaysData[index - 1].tripDay)) {
            this._eventContainerIndex++;
          }
          this._renderTripWaypoint(it, this._eventContainerIndex);
        });
        clearDaysData();
        break;
    }
  }

  _showStatistics() {
    Chart.defaults.global.defaultFontColor = `#000000`;
    Chart.defaults.global.defaultFontSize = 14;
    const moneyCtx = this._container.querySelector(`.statistics__chart--money`);
    const transportCtx = this._container.querySelector(`.statistics__chart--transport`);
    const timeCtx = this._container.querySelector(`.statistics__chart--time`);
    const moneyChart = new Chart(moneyCtx, {
      type: `horizontalBar`,
      plugins: [ChartDataLabels],
      data: {
        labels: waypointTypeNames.filter((name) => {
          return this._waypoints.some((it) => {
            return it.type === waypointType[name];
          });
        }).map((filteredName) => filteredName.toUpperCase()),
        datasets: [{
          data: waypointTypeNames.map((name) => {
            let sum = 0;

            this._waypoints.forEach((it) => {
              if (it.type === waypointType[name]) {
                sum += it.waypointPrice;
              }
            });

            return sum;
          }).filter((sum) => sum !== 0),
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        title: {
          display: true,
          text: `MONEY`,
          position: `left`,
          fontSize: 30,
          padding: 30,
          fontColor: `#000000`
        },
        plugins: {
          datalabels: {
            display: true,
            anchor: `end`,
            align: `start`,
            padding: 10,
            formatter(value) {
              return `€ ${value}`;
            },
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 1.1,
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            minBarLength: 50,
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        layout: {
          paddingTop: 10
        },
        tooltips: {
          enabled: true
        }
      },
    });
    const transportChart = new Chart(transportCtx, {
      type: `horizontalBar`,
      plugins: [ChartDataLabels],
      data: {
        labels: waypointTransportTypeNames.filter((name) => {
          return this._waypoints.some((it) => {
            return it.type === waypointType[name];
          });
        }).map((filteredName) => filteredName.toUpperCase()),
        datasets: [{
          data: waypointTypeNames.map((name) => {
            let sum = 0;

            this._waypoints.forEach((it) => {
              if (it.type === waypointType[name]) {
                sum++;
              }
            });

            return sum;
          }).filter((sum) => sum !== 0),
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        title: {
          display: true,
          text: `TRANSPORT`,
          position: `left`,
          fontSize: 30,
          padding: 30,
          fontColor: `#000000`
        },
        plugins: {
          datalabels: {
            display: true,
            anchor: `end`,
            align: `start`,
            padding: 10,
            formatter(value) {
              return `${value}x`;
            },
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 1.1,
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            minBarLength: 50,
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        layout: {
          paddingTop: 10
        },
        tooltips: {
          enabled: true
        }
      },
    });
    const destinations = [...new Set(this._waypoints.map((it) => {
      return it.city;
    }))];
    const timeChart = new Chart(timeCtx, {
      type: `horizontalBar`,
      plugins: [ChartDataLabels],
      data: {
        labels: destinations,
        datasets: [{
          data: destinations.map((name, index) => {
            let sum = 0;

            this._waypoints.forEach((it) => {
              if (it.city === destinations[index]) {
                sum += it.time.endTime - it.time.startTime;
              }
            });

            return sum;
          }),
          data1: waypointTypeNames.map((name) => {
            let sum = 0;

            this._waypoints.forEach((it) => {
              if (it.type === waypointType[name]) {
                sum += it.time.endTime - it.time.startTime;
              }
            });

            return sum;
          }).filter((result) => result !== 0),
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        title: {
          display: true,
          text: `TIME SPENT`,
          position: `left`,
          fontSize: 30,
          padding: 30,
          fontColor: `#000000`
        },
        plugins: {
          datalabels: {
            display: true,
            anchor: `end`,
            align: `start`,
            padding: 10,
            formatter(value) {
              return `${parseInt(value / MSECONDS_IN_SECOND / SECONDS_IN_MINUTE / MINUTES_IN_HOUR, 10)}H`;
            },
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 1.1,
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            minBarLength: 50,
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        layout: {
          paddingTop: 10
        },
        tooltips: {
          enabled: true,
        }
      },
    });

    this._container.querySelector(`.statistics`).classList.remove(`visually-hidden`);
    this._board.getElement().classList.add(`visually-hidden`);
    this._sort.getElement().classList.add(`visually-hidden`);
  }

  _hideStatistics() {
    this._container.querySelector(`.statistics`).classList.add(`visually-hidden`);
    this._board.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
  }
}

export default TripController;
