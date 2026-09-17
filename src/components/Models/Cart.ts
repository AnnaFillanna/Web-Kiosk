import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
export class Cart {
 private items: IProduct[] = [];
 constructor(private events: IEvents) {}


addItem(item: IProduct): void {
  this.items.push(item);
  this.events.emit('cart:changed', { items: this.items });
}
removeItem(id: string): void {
  this.items = this.items.filter((item) => item.id !== id);
  this.events.emit('cart:changed', { items: this.items });
}
 clear(): void {
  this.items = [];
  this.events.emit('cart:changed', { items: this.items });
}
  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }
  getCount(): number {
    return this.items.length;
  }
  getItems(): IProduct[] {
    return this.items;
  }
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
