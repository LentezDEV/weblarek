import type { IProduct } from '../types';
import { categoryMap, CDN_URL } from '../utils/constants';
import { Card, type ICardData } from './Card';
import type { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface ICardPreviewData extends ICardData, Pick<IProduct, 'category' | 'image' | 'description'> {
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;
    private readonly descriptionElement: HTMLElement;
    private readonly actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);

        this.actionButton.addEventListener('click', () => {
            this.events.emit('preview:toggle');
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

    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    set buttonText(value: string) {
        this.setText(this.actionButton, value);
    }

    set buttonDisabled(value: boolean) {
        this.setDisabled(this.actionButton, value);
    }
}
