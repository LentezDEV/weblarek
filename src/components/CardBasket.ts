import type { IEvents } from './base/Events';
import { Card, type ICardData } from './Card';
import { ensureElement } from '../utils/utils';

export interface ICardBasketData extends ICardData {
    index: number;
}

export class CardBasket extends Card<ICardBasketData> {
    private readonly indexElement: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', {
                id: this.container.dataset.id ?? '',
            });
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, value);
    }
}
