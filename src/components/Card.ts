import type { IProduct } from '../types';
import { categoryMap, CDN_URL } from '../utils/constants';
import { Component } from './base/Component';
import type { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface ICardData extends Pick<IProduct, 'id' | 'title' | 'category' | 'price'> {
    image?: string;
}

export abstract class Card<T> extends Component<T & ICardData> {
    protected readonly titleElement: HTMLElement;
    protected readonly priceElement: HTMLElement;
    protected readonly categoryElement: HTMLElement | null;
    protected readonly imageElement: HTMLImageElement | null;

    protected constructor(
        container: HTMLElement,
        protected readonly events: IEvents
    ) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
        this.categoryElement = container.querySelector<HTMLElement>('.card__category');
        this.imageElement = container.querySelector<HTMLImageElement>('.card__image');
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this.titleElement, value);

        if (this.imageElement) {
            this.imageElement.alt = value;
        }
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value === null ? 'Бесценно' : `${value} синапсов`);
    }

    set category(value: string) {
        if (!this.categoryElement) {
            return;
        }

        Object.values(categoryMap).forEach((className) => {
            this.categoryElement?.classList.remove(className);
        });

        this.setText(this.categoryElement, value);

        const className = categoryMap[value as keyof typeof categoryMap];

        if (className) {
            this.categoryElement.classList.add(className);
        }
    }

    set image(value: string) {
        if (!this.imageElement) {
            return;
        }

        const src = value.startsWith('http') ? value : `${CDN_URL}${value}`;

        super.setImage(this.imageElement, src, this.titleElement.textContent ?? '');
    }
}
