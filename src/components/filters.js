import AbstractComponent from "./abstract-components";

class Filters extends AbstractComponent {
  /**
   * @param {[string]} filters
   */
  constructor(filters) {
    super();
    this._filters = filters;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `
      <form class="trip-filters" action="#" method="get">
      ${this._filters.map((item, index) => `
        <div class="trip-filters__filter">
          <input id="filter-${item}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item}" ${index === 0 ? `checked=""` : ``}>
          <label class="trip-filters__filter-label" for="filter-${item}">${item}</label>
        </div>`).join(``)}
  
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }
}

export default Filters;
