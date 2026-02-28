import type { IProduct } from '../types';
import { Card, type ICardData } from './Card';
import type { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface ICardPreviewData extends ICardData, Pick<IProduct, 'description'> {
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
    private readonly descriptionElement: HTMLElement;
    private readonly actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);

        this.actionButton.addEventListener('click', () => {
            this.events.emit('card:add', {
                id: this.container.dataset.id ?? '',
            });
        });
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
