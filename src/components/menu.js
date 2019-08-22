import {createElement} from "../utils";

class Menu {
  /**
   * @param {[string]} menus
   */
  constructor(menus) {
    this._menus = menus;
    this._element = null;
  }

  /**
   * @return {null | Node}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
      ${this._menus.map((item, index) => `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${item}</a>`).join(``)}
      </nav>
    `;
  }
}

export default Menu;
