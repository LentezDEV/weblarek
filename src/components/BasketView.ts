import { Component } from './base/Component';
import type { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IBasketViewData {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export class BasketView extends Component<IBasketViewData> {
    private readonly listElement: HTMLElement;
    private readonly totalElement: HTMLElement;
    private readonly submitButton: HTMLButtonElement;
    private readonly emptyElement: HTMLLIElement;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.emptyElement = document.createElement('li');
        this.emptyElement.className = 'basket__empty';
        this.emptyElement.textContent = 'Корзина пуста';

        this.submitButton.addEventListener('click', () => {
            this.events.emit('basket:submit');
        });
    }

    set items(value: HTMLElement[]) {
        this.setChildren(this.listElement, value.length ? value : [this.emptyElement]);
    }

    set total(value: number) {
        this.setText(this.totalElement, `${value} синапсов`);
    }

    set disabled(value: boolean) {
        this.setDisabled(this.submitButton, value);
    }
}
