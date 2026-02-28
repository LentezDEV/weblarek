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
import { apiProducts } from './utils/data';
import { cloneTemplate, ensureElement } from './utils/utils';

const [firstProduct, secondProduct, thirdProduct] = apiProducts.items;

if (!firstProduct || !secondProduct || !thirdProduct) {
  console.error('Ошибка. Отсутствуют продукты');
} else {
  const events = new EventEmitter();

  events.onAll(({ eventName, data }) => {
    console.log('App: событие', eventName, data);
  });

  const productsCatalogModel = new ProductsCatalog(events);

  productsCatalogModel.setItems(apiProducts.items);
  console.log('Каталог: список товаров после setItems', productsCatalogModel.getItems());
  console.log('Каталог: поиск товара по корректному id', productsCatalogModel.getItem(firstProduct.id));
  console.log('Каталог: поиск товара по несуществующему id', productsCatalogModel.getItem('Error-id'));

  productsCatalogModel.setPreview(secondProduct);
  console.log('Каталог: выбранный товар в preview', productsCatalogModel.getPreview());
  productsCatalogModel.setPreview(null);
  console.log('Каталог: preview после очистки', productsCatalogModel.getPreview());

  const basketModel = new Basket(events);

  console.log('Корзина: начальный список товаров', basketModel.getItems());
  console.log('Корзина: начальное количество товаров', basketModel.getCount());
  console.log('Корзина: начальная сумма товаров', basketModel.getTotal());

  basketModel.addItem(firstProduct);
  basketModel.addItem(secondProduct);
  basketModel.addItem(thirdProduct);

  console.log('Корзина: товары после addItem', basketModel.getItems());
  console.log('Корзина: проверка наличия firstProduct', basketModel.hasItem(firstProduct.id));
  console.log('Корзина: количество после addItem', basketModel.getCount());
  console.log('Корзина: сумма после addItem', basketModel.getTotal());

  basketModel.removeItem(secondProduct);
  console.log('Корзина: товары после removeItem(secondProduct)', basketModel.getItems());
  console.log('Корзина: количество после removeItem', basketModel.getCount());
  console.log('Корзина: сумма после removeItem', basketModel.getTotal());

  basketModel.clear();
  console.log('Корзина: товары после clear', basketModel.getItems());
  console.log('Корзина: количество после clear', basketModel.getCount());

  const buyerModel = new Buyer(events);

  console.log('Покупатель: начальные данные', buyerModel.getData());
  console.log('Покупатель: валидация начального состояния', buyerModel.validate());

  buyerModel.setData({
    payment: 'card',
    email: 'user@example.com',
  });
  console.log('Покупатель: данные после частичного setData (payment, email)', buyerModel.getData());
  console.log('Покупатель: валидация после первого setData', buyerModel.validate());

  buyerModel.setData({
    phone: '+7 999 000 999',
    address: '1 Советская д1 к2',
  });
  console.log('Покупатель: данные после второго setData (phone, address)', buyerModel.getData());
  console.log('Покупатель: валидация после второго setData', buyerModel.validate());

  buyerModel.clear();
  console.log('Покупатель: данные после clear', buyerModel.getData());
  console.log('Покупатель: валидация после clear', buyerModel.validate());

  const header = new Header(ensureElement<HTMLElement>('.header'), events);
  const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
  const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

  const catalogCard = new CardCatalog(cloneTemplate<HTMLButtonElement>('#card-catalog'), events);
  const previewCard = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), events);
  const basketCard = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), events);
  const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
  const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
  const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
  const orderSuccess = new OrderSuccess(cloneTemplate<HTMLElement>('#success'), events);

  header.render({ counter: basketModel.getCount() });

  const catalogCardElement = catalogCard.render({
    ...firstProduct,
    image: firstProduct.image,
  });

  const previewCardElement = previewCard.render({
    ...secondProduct,
    image: secondProduct.image,
    buttonText: 'В корзину',
    buttonDisabled: false,
  });

  const basketCardElement = basketCard.render({
    ...thirdProduct,
    index: 1,
  });

  gallery.render({
    items: [catalogCardElement],
  });

  basketView.render({
    items: [basketCardElement],
    total: basketModel.getTotal(),
    disabled: false,
  });

  orderForm.render({
    payment: 'card',
    address: 'Тестовый адрес',
    valid: true,
    errors: '',
  });

  contactsForm.render({
    email: 'user@example.com',
    phone: '+7 999 000 999',
    valid: true,
    errors: '',
  });

  orderSuccess.render({
    total: basketModel.getTotal(),
  });

  modal.render({
    content: previewCardElement,
  });
  modal.open();

  catalogCardElement.click();
  previewCardElement.querySelector<HTMLButtonElement>('.card__button')?.click();
  basketCardElement.querySelector<HTMLButtonElement>('.basket__item-delete')?.click();
  basketView.render().querySelector<HTMLButtonElement>('.basket__button')?.click();
  orderForm.render().querySelector<HTMLButtonElement>('button[name="cash"]')?.click();
  orderForm.render().querySelector<HTMLInputElement>('input[name="address"]')?.dispatchEvent(new Event('input', { bubbles: true }));
  orderForm.render().dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  contactsForm.render().querySelector<HTMLInputElement>('input[name="email"]')?.dispatchEvent(new Event('input', { bubbles: true }));
  contactsForm.render().querySelector<HTMLInputElement>('input[name="phone"]')?.dispatchEvent(new Event('input', { bubbles: true }));
  contactsForm.render().dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  modal.render().querySelector<HTMLButtonElement>('.modal__close')?.click();
  modal.close();
  orderSuccess.render().querySelector<HTMLButtonElement>('.order-success__close')?.click();
}

const webLarekApi = new WebLarekApi(new Api(API_URL));
const serverProductsCatalogModel = new ProductsCatalog();

webLarekApi
  .getProducts()
  .then((products) => {
    serverProductsCatalogModel.setItems(products);
    console.log('Каталог с сервера: товары после сохранения в модель', serverProductsCatalogModel.getItems());
  })
  .catch((error: unknown) => {
    console.error('Ошибка:', error);
  });
