import { Component } from "../../base/Component";

interface ICardBasket {
  title: string;
  price: number;
  index: number;
}

interface ICardBasketActions {
  onClick: () => void;
}

export class CardBasket extends Component<ICardBasket> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardBasketActions) {
    super(container);

    this.titleElement = container.querySelector(".card__title")!;
    this.priceElement = container.querySelector(".card__price")!;
    this.indexElement = container.querySelector(".basket__item-index")!;
    this.deleteButton = container.querySelector(".basket__item-delete")!;

    this.deleteButton.addEventListener("click", actions.onClick);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
