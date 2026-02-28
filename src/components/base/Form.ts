import { Component } from './Component';
import type { IEvents } from './Events';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
    valid: boolean;
    errors: string;
}

type TFormChangeData = {
    field: string;
    value: string;
};

export abstract class Form<T> extends Component<T & IFormState> {
    protected declare readonly container: HTMLFormElement;
    protected readonly submitButton: HTMLButtonElement;
    protected readonly errorsElement: HTMLElement;

    protected constructor(
        container: HTMLFormElement,
        protected readonly events: IEvents
    ) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });

        this.container.addEventListener('input', (event) => {
            const target = event.target;

            if (!(target instanceof HTMLInputElement)) {
                return;
            }

            this.events.emit<TFormChangeData>(`${this.container.name}.${target.name}:change`, {
                field: target.name,
                value: target.value,
            });
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this.submitButton, !value);
    }

    set errors(value: string) {
        this.setText(this.errorsElement, value);
    }

}
