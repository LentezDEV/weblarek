import type { IEvents } from '../base/Events';
import type { IProduct } from '../../types';

export class Basket {
  private items: IProduct[] = [];

  constructor(private readonly events?: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events?.emit('basket:changed', {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
    });
  }

  removeItem(item: IProduct): void {
    const index = this.items.findIndex((basketItem) => basketItem.id === item.id);

    if (index !== -1) {
      this.items.splice(index, 1);
      this.events?.emit('basket:changed', {
        items: this.getItems(),
        total: this.getTotal(),
        count: this.getCount(),
      });
    }
  }

  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items = [];
    this.events?.emit('basket:changed', {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
    });
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
