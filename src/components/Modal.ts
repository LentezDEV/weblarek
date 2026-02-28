import { Component } from './base/Component';
import type { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    private readonly closeButton: HTMLButtonElement;
    private readonly contentElement: HTMLElement;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.events.emit('modal:close');
            }
        });
    }

    set content(value: HTMLElement) {
        this.setChildren(this.contentElement, [value]);
    }

    open() {
        this.toggleClass(this.container, 'modal_active', true);
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        this.contentElement.replaceChildren();
    }
}
