import type { IProduct } from '../../types';


export class Catalog {
private items: IProduct[] = [];
private selectedProduct: IProduct | null = null;
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }
  getItem(id: string): IProduct | undefined {
  return this.items.find((item) => item.id === id);
}
setSelectedProduct(product: IProduct): void {
  this.selectedProduct = product;
}

getSelectedProduct(): IProduct | null {
  return this.selectedProduct;
}
}