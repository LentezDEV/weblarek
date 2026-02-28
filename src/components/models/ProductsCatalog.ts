import type { IEvents } from '../base/Events';
import type { IProduct } from '../../types';

export class ProductsCatalog {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private readonly events?: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events?.emit('catalog:changed', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(item: IProduct | null): void {
        if (this.preview === item) {
            return;
        }

        this.preview = item;
        this.events?.emit('catalog:previewChanged', { preview: this.preview });
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}
