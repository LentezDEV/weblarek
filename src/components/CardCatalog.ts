import type { IEvents } from './base/Events';
import { Card, type ICardData } from './Card';

export class CardCatalog extends Card<ICardData> {
    constructor(container: HTMLButtonElement, events: IEvents) {
        super(container, events);

        container.addEventListener('click', () => {
            this.events.emit('card:select', {
                id: this.container.dataset.id ?? '',
            });
        });
    }
}
