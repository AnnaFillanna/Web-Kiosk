import { Card } from "./Card";
import { categoryMap } from "../../../utils/constants";
type CategoryKey = keyof typeof categoryMap;

// interface ICardPreview {
//     title: string;
//     price: number | null;
//     image: string;
//     category: string;
//     description: string;
// }

interface ICardPreviewActions {
  onClick: () => void;
}

export class CardPreview extends Card {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.imageElement = container.querySelector(".card__image")!;
    this.categoryElement = container.querySelector(".card__category")!;
    this.descriptionElement = container.querySelector(".card__text")!;
    this.buttonElement = container.querySelector(".card__button")!;

    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      value,
      this.titleElement.textContent || "",
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }
  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}
