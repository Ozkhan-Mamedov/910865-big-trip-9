/**
 * @param { [string] } filters
 * @return {string}
 */
export const getFiltersComponent = (filters) => {
  return `
    <form class="trip-filters" action="#" method="get">
    ${filters.map((item, index) => `
      <div class="trip-filters__filter">
        <input id="filter-${item}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item}" ${index === 0 ? `checked=""` : ``}>
        <label class="trip-filters__filter-label" for="filter-${item}">${item}</label>
      </div>`).join(``)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};
