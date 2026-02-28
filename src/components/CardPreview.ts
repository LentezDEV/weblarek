import type { IProduct } from '../types';
import { Card, type ICardData } from './Card';
import type { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface ICardPreviewData extends ICardData, Pick<IProduct, 'description'> {
    buttonText: string;
    buttonDisabled: boolean;
    buttonAction: 'add' | 'remove';
}

export class CardPreview extends Card<ICardPreviewData> {
    private readonly descriptionElement: HTMLElement;
    private readonly actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);

        this.actionButton.addEventListener('click', () => {
            const eventName = this.actionButton.dataset.action === 'remove' ? 'card:remove' : 'card:add';

            this.events.emit(eventName, {
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

    set buttonAction(value: 'add' | 'remove') {
        this.actionButton.dataset.action = value;
    }
}
