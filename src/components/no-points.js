import AbstractComponent from "./abstract-components";

class NoPoints extends AbstractComponent {
  constructor() {
    super();
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}

export default NoPoints;
