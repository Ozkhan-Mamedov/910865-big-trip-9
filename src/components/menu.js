import AbstractComponent from "./abstract-components";

class Menu extends AbstractComponent {
  /**
   * @param {[string]} menus
   */
  constructor(menus) {
    super();
    this._menus = menus;
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
