import AbstractComponent from "./abstract-components";

class LoadingScreen extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }
}

export default LoadingScreen;
