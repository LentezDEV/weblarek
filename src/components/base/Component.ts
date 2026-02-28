/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Установить изображение с альтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setText(element: HTMLElement, value: unknown) {
        element.textContent = value === null || value === undefined ? '' : String(value);
    }

    protected setDisabled(element: HTMLElement, state: boolean) {
        if ('disabled' in element) {
            (element as HTMLButtonElement).disabled = state;
        }
    }

    protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    protected setChildren(element: HTMLElement, children: HTMLElement[]) {
        element.replaceChildren(...children);
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
