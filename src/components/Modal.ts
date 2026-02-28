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
    }

    set content(value: HTMLElement) {
        this.setChildren(this.contentElement, [value]);
    }

    private closeByEsc = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.events.emit('modal:close');
        }
    };

    open() {
        this.toggleClass(this.container, 'modal_active', true);
        document.addEventListener('keydown', this.closeByEsc);
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        document.removeEventListener('keydown', this.closeByEsc);
        this.contentElement.replaceChildren();
    }
}
