import { Card } from "./Card";

interface ICardCatalogActions {
  onClick: () => void;
}

export class CardCatalog extends Card {
  protected imageElement: HTMLImageElement;
  constructor(container: HTMLElement, actions?: ICardCatalogActions) {
    super(container);
    this.imageElement =
      container.querySelector<HTMLImageElement>(".card__image")!;

    if (actions?.onClick) {
      container.addEventListener("click", () => {
        actions.onClick();
      });
    }
  }
  set image(value: string) {
    this.imageElement.src = value;
  }
}
