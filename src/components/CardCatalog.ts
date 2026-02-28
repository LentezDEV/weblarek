import type { IProduct } from '../types';
import { categoryMap, CDN_URL } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Card, type ICardData } from './Card';

export interface ICardCatalogData extends ICardData, Pick<IProduct, 'category' | 'image'> {}

export interface ICardCatalogActions {
    onSelect: () => void;
}

export class CardCatalog extends Card<ICardCatalogData> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;

    constructor(container: HTMLButtonElement, actions: ICardCatalogActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        container.addEventListener('click', () => {
            actions.onSelect();
        });
    }

    set title(value: string) {
        super.title = value;
        this.imageElement.alt = value;
    }

    set category(value: string) {
        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });

        this.setText(this.categoryElement, value);

        const className = categoryMap[value as keyof typeof categoryMap];

        if (className) {
            this.categoryElement.classList.add(className);
        }
    }

    set image(value: string) {
        const src = value.startsWith('http') ? value : `${CDN_URL}${value}`;
        this.setImage(this.imageElement, src, this.titleElement.textContent ?? '');
    }
}
