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
  console.error('Ошибка. Отсутсвуют продукты');
} else {
  const productsCatalogModel = new ProductsCatalog();

  productsCatalogModel.setItems(apiProducts.items);
  console.log( productsCatalogModel.getItems());
  console.log( productsCatalogModel.getItem(firstProduct.id));
  console.log( productsCatalogModel.getItem('Error-id'));

  productsCatalogModel.setPreview(secondProduct);
  console.log( productsCatalogModel.getPreview());
  productsCatalogModel.setPreview(null);
  console.log( productsCatalogModel.getPreview());

  const basketModel = new Basket();

  console.log(basketModel.getItems());
  console.log(basketModel.getCount());
  console.log(basketModel.getTotal());

  basketModel.addItem(firstProduct);
  basketModel.addItem(secondProduct);
  basketModel.addItem(thirdProduct);

  console.log( basketModel.getItems());
  console.log( basketModel.hasItem(firstProduct.id));
  console.log( basketModel.getCount());
  console.log( basketModel.getTotal());

  basketModel.removeItem(secondProduct);
  console.log( basketModel.getItems());
  console.log( basketModel.getCount());
  console.log( basketModel.getTotal());

  basketModel.clear();
  console.log( basketModel.getItems());
  console.log( basketModel.getCount());

  const buyerModel = new Buyer();

  console.log( buyerModel.getData());
  console.log( buyerModel.validate());

  buyerModel.setData({
    payment: 'card',
    email: 'user@example.com',
  });
  console.log( buyerModel.getData());
  console.log( buyerModel.validate());

  buyerModel.setData({
    phone: '+7 999 000 999',
    address: '1 Советская д1 к2',
  });
  console.log( buyerModel.getData());
  console.log( buyerModel.validate());

  buyerModel.clear();
  console.log( buyerModel.getData());
  console.log( buyerModel.validate());
}

const webLarekApi = new WebLarekApi(new Api(API_URL));
const serverProductsCatalogModel = new ProductsCatalog();

webLarekApi
  .getProducts()
  .then((products) => {
    serverProductsCatalogModel.setItems(products);
    console.log( serverProductsCatalogModel.getItems());
  })
  .catch((error: unknown) => {
    console.error('Ошибка:', error);
  });
