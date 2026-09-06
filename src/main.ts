import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { KioskApi } from './components/KioskApi';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);
const catalog = new Catalog();
catalog.setItems(apiProducts.items);
const cart = new Cart();
const buyer = new Buyer();
const kioskApi = new KioskApi(api);

kioskApi.getProducts()
  .then((data) => {
    catalog.setItems(data.items);
    console.log('Каталог с сервера:', catalog.getItems());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });

buyer.setData({
  payment: 'card',
  address: 'Teststraße 1',
  email: 'test@test.de',
  phone: '0123456789',
});

console.log('Данные покупателя:', buyer.getData());
console.log('Ошибки:', buyer.validate());

buyer.setData({
  email: '',
});

console.log(
  'Ошибки при незаполненном email:',
  buyer.validate()
);

buyer.clear();

console.log(
  'Данные покупателя после очистки:',
  buyer.getData()
);

console.log(
  'Ошибки после очистки:',
  buyer.validate()
);

console.log('Каталог:', catalog.getItems());
console.log('Первый товар:', catalog.getItem(apiProducts.items[0].id));

catalog.setSelectedProduct(apiProducts.items[0]);

console.log('Выбранный товар:', catalog.getSelectedProduct());

cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);

console.log('Корзина:', cart.getItems());
console.log('Количество товаров:', cart.getCount());
console.log('Сумма корзины:', cart.getTotal());
console.log(
  'Есть ли первый товар:',
  cart.hasItem(apiProducts.items[0].id)
);
cart.removeItem(apiProducts.items[0].id);

console.log('После удаления:', cart.getItems());
console.log('Количество после удаления:', cart.getCount());
cart.clear();

console.log('После очистки корзины:', cart.getItems());
console.log('Количество после очистки:', cart.getCount());

