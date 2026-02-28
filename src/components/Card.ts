import type { IProduct } from '../types';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

export interface ICardData extends Pick<IProduct, 'title' | 'price'> {}

export abstract class Card<T> extends Component<T & ICardData> {
    protected readonly titleElement: HTMLElement;
    protected readonly priceElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value === null ? 'Бесценно' : `${value} синапсов`);
    }
}
