import { Component } from "../base/Component";

interface IModal {
  content: HTMLElement;
}

interface IModalActions {
  onClose?: () => void;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IModalActions) {
    super(container);

    this.closeButton = container.querySelector(".modal__close")!;
    this.contentElement = container.querySelector(".modal__content")!;

    this.closeButton.addEventListener("click", () => {
      this.close();

      if (actions?.onClose) {
        actions.onClose();
      }
    });

    this.container.addEventListener("mousedown", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
