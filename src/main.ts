import './scss/styles.scss';

import { BasketView } from './components/BasketView';
import { CardBasket } from './components/CardBasket';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { ContactsForm } from './components/ContactsForm';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { OrderForm } from './components/OrderForm';
import { OrderSuccess } from './components/OrderSuccess';
import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { ProductsCatalog } from './components/models/ProductsCatalog';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

type TModalView = 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null;

const events = new EventEmitter();
const webLarekApi = new WebLarekApi(new Api(API_URL));

const productsCatalogModel = new ProductsCatalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const previewCard = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), events);
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const orderSuccess = new OrderSuccess(cloneTemplate<HTMLElement>('#success'), events);

let activeModalView: TModalView = null;

function formatErrors(messages: Array<string | undefined>): string {
  return messages
    .filter((message): message is string => Boolean(message))
    .join('; ');
}

function setModalContent(
  content: HTMLElement,
  view: Exclude<TModalView, null>,
  openModal = true,
): void {
  activeModalView = view;
  modal.render({ content });

  if (openModal) {
    modal.open();
  }
}

function closeModal(): void {
  activeModalView = null;
  modal.close();
}

function renderPreview(openModal = true): void {
  const product = productsCatalogModel.getPreview();

  if (!product) {
    return;
  }

  const inBasket = basketModel.hasItem(product.id);
  const unavailable = product.price === null;
  const buttonText = unavailable ? 'Недоступно' : inBasket ? 'Удалить из корзины' : 'Купить';

  setModalContent(
    previewCard.render({
      ...product,
      buttonText,
      buttonDisabled: unavailable,
      buttonAction: inBasket ? 'remove' : 'add',
    }),
    'preview',
    openModal,
  );
}

function renderBasket(openModal = true): void {
  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), events);

    return card.render({
      ...item,
      index: index + 1,
    });
  });

  setModalContent(
    basketView.render({
      items,
      total: basketModel.getTotal(),
      disabled: basketModel.getCount() === 0,
    }),
    'basket',
    openModal,
  );
}

function renderOrder(openModal = true): void {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  setModalContent(
    orderForm.render({
      payment: buyerData.payment ?? null,
      address: buyerData.address ?? '',
      valid: !errors.payment && !errors.address,
      errors: formatErrors([errors.payment, errors.address]),
    }),
    'order',
    openModal,
  );
}

function renderContacts(openModal = true): void {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  setModalContent(
    contactsForm.render({
      email: buyerData.email ?? '',
      phone: buyerData.phone ?? '',
      valid: !errors.email && !errors.phone,
      errors: formatErrors([errors.email, errors.phone]),
    }),
    'contacts',
    openModal,
  );
}

function renderSuccess(total: number): void {
  setModalContent(
    orderSuccess.render({ total }),
    'success',
  );
}

events.on('catalog:changed', () => {
  const cards = productsCatalogModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate<HTMLButtonElement>('#card-catalog'), events);

    return card.render(item);
  });

  gallery.render({ items: cards });
});

events.on('catalog:previewChanged', () => {
  if (productsCatalogModel.getPreview()) {
    renderPreview();
    return;
  }

  if (activeModalView === 'preview') {
    closeModal();
  }
});

events.on('basket:changed', () => {
  header.render({ counter: basketModel.getCount() });

  if (activeModalView === 'basket') {
    renderBasket(false);
    return;
  }

  if (activeModalView === 'preview' && productsCatalogModel.getPreview()) {
    renderPreview(false);
  }
});

events.on('buyer:changed', () => {
  if (activeModalView === 'order') {
    renderOrder(false);
    return;
  }

  if (activeModalView === 'contacts') {
    renderContacts(false);
  }
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = productsCatalogModel.getItem(id);

  if (product) {
    productsCatalogModel.setPreview(product);
  }
});

events.on<{ id: string }>('card:add', ({ id }) => {
  const product = productsCatalogModel.getItem(id);

  if (!product || product.price === null || basketModel.hasItem(product.id)) {
    return;
  }

  productsCatalogModel.setPreview(null);
  basketModel.addItem(product);
});

events.on<{ id: string }>('card:remove', ({ id }) => {
  const product = basketModel.getItems().find((item) => item.id === id);

  if (!product) {
    return;
  }

  productsCatalogModel.setPreview(null);
  basketModel.removeItem(product);
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
  const product = basketModel.getItems().find((item) => item.id === id);

  if (product) {
    basketModel.removeItem(product);
  }
});

events.on('basket:open', () => {
  renderBasket();
});

events.on('basket:submit', () => {
  if (basketModel.getCount() === 0) {
    return;
  }

  renderOrder();
});

events.on<{ payment: 'card' | 'cash' }>('order.payment:change', ({ payment }) => {
  buyerModel.setData({ payment });
});

events.on<{ value: string }>('order.address:change', ({ value }) => {
  buyerModel.setData({ address: value });
});

events.on('order:submit', () => {
  const errors = buyerModel.validate();

  if (errors.payment || errors.address || basketModel.getCount() === 0) {
    return;
  }

  renderContacts();
});

events.on<{ value: string }>('contacts.email:change', ({ value }) => {
  buyerModel.setData({ email: value });
});

events.on<{ value: string }>('contacts.phone:change', ({ value }) => {
  buyerModel.setData({ phone: value });
});

events.on('contacts:submit', () => {
  const errors = buyerModel.validate();
  const buyerData = buyerModel.getData();
  const basketItems = basketModel.getItems();

  if (
    errors.payment ||
    errors.address ||
    errors.email ||
    errors.phone ||
    !buyerData.payment ||
    !buyerData.email ||
    !buyerData.phone ||
    !buyerData.address ||
    basketItems.length === 0
  ) {
    return;
  }

  webLarekApi
    .createOrder({
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      items: basketItems.map((item) => item.id),
      total: basketModel.getTotal(),
    })
    .then((result) => {
      renderSuccess(result.total);
      basketModel.clear();
      buyerModel.clear();
      productsCatalogModel.setPreview(null);
    })
    .catch((error: unknown) => {
      console.error('Ошибка оформления заказа:', error);
    });
});

events.on('modal:close', () => {
  if (activeModalView === 'preview') {
    productsCatalogModel.setPreview(null);
    return;
  }

  closeModal();
});

events.on('success:close', () => {
  closeModal();
});

header.render({ counter: basketModel.getCount() });

webLarekApi
  .getProducts()
  .then((products) => {
    productsCatalogModel.setItems(products);
  })
  .catch((error: unknown) => {
    console.error('Ошибка загрузки товаров:', error);
  });
