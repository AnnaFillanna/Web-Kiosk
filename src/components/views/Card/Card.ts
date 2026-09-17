import { Component } from "../../base/Component";

interface ICard {
  title: string;
  price: number | null;
}

export class Card extends Component<ICard> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector<HTMLElement>(".card__title")!;

    this.priceElement = container.querySelector<HTMLElement>(".card__price")!;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }
}
