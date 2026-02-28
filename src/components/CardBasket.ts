import { Card, type ICardData } from './Card';
import { ensureElement } from '../utils/utils';

export interface ICardBasketData extends ICardData {
    index: number;
}

export interface ICardBasketActions {
    onDelete: () => void;
}

export class CardBasket extends Card<ICardBasketData> {
    private readonly indexElement: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardBasketActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            actions.onDelete();
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, value);
    }
}
