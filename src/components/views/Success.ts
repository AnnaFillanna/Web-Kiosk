import { Component } from "../base/Component";

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._close = container.querySelector<HTMLButtonElement>(
      ".order-success__close",
    )!;
    this._description = container.querySelector<HTMLElement>(
      ".order-success__description",
    )!;

    this._close.addEventListener("click", actions.onClick);
  }

  set total(value: number) {
    this._description.textContent = `Charged ${value} synapses`;
  }
}
