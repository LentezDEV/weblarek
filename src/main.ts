import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { ProductsCatalog } from './components/models/ProductsCatalog';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const [firstProduct, secondProduct, thirdProduct] = apiProducts.items;

if (!firstProduct || !secondProduct || !thirdProduct) {
  console.error('Ошибка. Отсутствуют продукты');
} else {
  const productsCatalogModel = new ProductsCatalog();

  productsCatalogModel.setItems(apiProducts.items);
  console.log('Каталог: список товаров после setItems', productsCatalogModel.getItems());
  console.log('Каталог: поиск товара по корректному id', productsCatalogModel.getItem(firstProduct.id));
  console.log('Каталог: поиск товара по несуществующему id', productsCatalogModel.getItem('Error-id'));

  productsCatalogModel.setPreview(secondProduct);
  console.log('Каталог: выбранный товар в preview', productsCatalogModel.getPreview());
  productsCatalogModel.setPreview(null);
  console.log('Каталог: preview после очистки', productsCatalogModel.getPreview());

  const basketModel = new Basket();

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

  const buyerModel = new Buyer();

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
