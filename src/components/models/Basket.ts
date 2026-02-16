import type { IProduct } from '../../types';

export class Basket {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  removeItem(item: IProduct): void {
    const index = this.items.findIndex((basketItem) => basketItem.id === item.id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  clear(): void {
    this.items = [];
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
