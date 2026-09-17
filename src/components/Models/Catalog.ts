import type { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("items:changed", { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }
  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("product:selected", { product: this.selectedProduct });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
