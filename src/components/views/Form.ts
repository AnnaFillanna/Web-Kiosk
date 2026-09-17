import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
interface IForm {
  valid: boolean;
  errors: string[];
}

export class Form extends Component<IForm> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);

    this.submitButton = container.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    )!;

    this.errorsElement = container.querySelector<HTMLElement>(".form__errors")!;
    container.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;

      this.events.emit(`${container.name}.${target.name}:change`, {
        field: target.name,
        value: target.value,
      });
    });

    container.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLButtonElement;

      if (target.name === "card" || target.name === "cash") {
        this.events.emit(`${container.name}.payment:change`, {
          payment: target.name,
        });
      }
    });

    container.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();

      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorsElement.textContent = value.join(", ");
  }
  reset(): void {
    (this.container as HTMLFormElement).reset();
  }
}
