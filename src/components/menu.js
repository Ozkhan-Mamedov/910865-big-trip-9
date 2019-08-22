/**
 * @param { [string] } menus
 * @return {string}
 */
export const getMenuComponent = (menus) => {
  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
    ${menus.map((item, index) => `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${item}</a>`).join(``)}
    </nav>
  `;
};
