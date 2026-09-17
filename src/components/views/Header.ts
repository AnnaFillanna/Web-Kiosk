import { Component } from "../base/Component";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, onBasketClick: () => void) {
    super(container);

    this.basketButton = container.querySelector(".header__basket")!;
    this.counterElement = container.querySelector(".header__basket-counter")!;

    this.basketButton.addEventListener("click", onBasketClick);
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
