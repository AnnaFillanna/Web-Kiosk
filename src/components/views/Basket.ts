import { Component } from "../base/Component";

interface IBasket {
  items: HTMLElement[];
  total: number;
}

interface IBasketActions {
  onClick: () => void;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this.listElement = container.querySelector(".basket__list")!;
    this.totalElement = container.querySelector(".basket__price")!;
    this.buttonElement = container.querySelector(".basket__button")!;

    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
    this.buttonElement.disabled = value.length === 0;
  }

  set total(value: number) {
   this.totalElement.textContent = `${value} synapses`;
  }
}
