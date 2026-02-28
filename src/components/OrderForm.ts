import type { TPayment } from '../types';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { Form } from './base/Form';
import type { IEvents } from './base/Events';

export interface IOrderFormData {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    private readonly paymentButtons: HTMLButtonElement[];
    private readonly addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.events.emit('order.payment:change', {
                    payment: button.name as TPayment,
                });
            });
        });
    }

    set payment(value: TPayment) {
        this.paymentButtons.forEach((button) => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}
