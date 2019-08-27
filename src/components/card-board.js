import AbstractComponent from "./abstract-components";

class CardBoard extends AbstractComponent {
  constructor() {
    super();
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `
      <ul class="trip-days">
      </ul>
    `;
  }
}

export default CardBoard;
