import "./scss/styles.scss";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/Card/CardCatalog";
import { CardPreview } from "./components/views/Card/CardPreview";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { IProduct, TPayment, IOrder, IOrderResponse } from "./types";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { CardBasket } from "./components/views/Card/CardBasket";
import { Form } from "./components/views/Form";
const headerElement = document.querySelector<HTMLElement>(".header")!;
const galleryElement = document.querySelector<HTMLElement>(".gallery")!;
const cardCatalogTemplate =
  document.querySelector<HTMLTemplateElement>("#card-catalog")!;
const cardPreviewTemplate =
  document.querySelector<HTMLTemplateElement>("#card-preview")!;
const cardBasketTemplate =
  document.querySelector<HTMLTemplateElement>("#card-basket")!;
const basketTemplate = document.querySelector<HTMLTemplateElement>("#basket")!;
const orderTemplate = document.querySelector<HTMLTemplateElement>("#order")!;
const contactsTemplate =
  document.querySelector<HTMLTemplateElement>("#contacts")!;
const modalElement = document.querySelector<HTMLElement>("#modal-container")!;

const gallery = new Gallery(galleryElement);
const events = new EventEmitter();
const api = new Api(API_URL);
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const modal = new Modal(modalElement);

const basketElement = basketTemplate.content
  .querySelector<HTMLElement>(".basket")!
  .cloneNode(true) as HTMLElement;
const orderElement = orderTemplate.content
  .querySelector<HTMLFormElement>(".form")!
  .cloneNode(true) as HTMLFormElement;
const successTemplate =
  document.querySelector<HTMLTemplateElement>("#success")!;

const successElement = successTemplate.content
  .querySelector<HTMLElement>(".order-success")!
  .cloneNode(true) as HTMLElement;
const successButton = successElement.querySelector<HTMLButtonElement>(
  ".order-success__close",
)!;

successButton.addEventListener("click", () => {
  modal.close();
});
const basket = new Basket(basketElement, {
  onClick: () => {
    modal.content = orderElement;
    modal.open();
  },
});

const header = new Header(headerElement, () => {
  modal.content = basketElement;
  modal.open();
});

const orderForm = new Form(orderElement, events);
const contactsElement = contactsTemplate.content
  .querySelector<HTMLFormElement>(".form")!
  .cloneNode(true) as HTMLFormElement;

const contactsForm = new Form(contactsElement, events);
events.on<{ field: string; value: string }>("order.address:change", (data) => {
  buyer.setData({ address: data.value });
});
events.on("order:submit", () => {
  modal.content = contactsElement;
});
events.on("order.payment:change", (data: { payment: TPayment }) => {
  buyer.setData({ payment: data.payment });
});
events.on<{ field: string; value: string }>("contacts.email:change", (data) => {
  buyer.setData({ email: data.value });
});

events.on<{ field: string; value: string }>("contacts.phone:change", (data) => {
  buyer.setData({ phone: data.value });
});
events.on("buyer:changed", () => {
  const errors = buyer.validate();

  orderForm.valid = !errors.payment && !errors.address;

  orderForm.errors = [errors.payment, errors.address].filter(
    Boolean,
  ) as string[];

  contactsForm.valid = !errors.email && !errors.phone;

  contactsForm.errors = [errors.email, errors.phone].filter(
    Boolean,
  ) as string[];
});
events.on("contacts:submit", () => {
  const buyerData = buyer.getData();
  if (!buyerData.payment) {
    return;
  }

  const order: IOrder = {
    payment: buyerData.payment,
    address: buyerData.address,
    email: buyerData.email,
    phone: buyerData.phone,
    total: cart.getTotal(),
    items: cart.getItems().map((item) => item.id),
  };

  api.post("/order/", order).then((result) => {
    const successDescription = successElement.querySelector<HTMLElement>(
      ".order-success__description",
    )!;

    successDescription.textContent = `Списано ${(result as IOrderResponse).total} синапсов`;

    cart.clear();
    buyer.clear();

    orderForm.reset();
    contactsForm.reset();
    modal.content = successElement;
    modal.open();
  });
});
events.on<{ items: IProduct[] }>("items:changed", (data) => {
  const cards = data.items.map((item) => {
    const cardElement = cardCatalogTemplate.content
      .querySelector<HTMLElement>(".card")!
      .cloneNode(true) as HTMLElement;

    const card = new CardCatalog(cardElement, {
      onClick: () => {
        catalog.setSelectedProduct(item);
      },
    });
    card.title = item.title;
    card.price = item.price;
    card.image = CDN_URL + item.image;
    return cardElement;
  });
  gallery.catalog = cards;
});
events.on<{ product: IProduct }>("product:selected", (data) => {
  const item = data.product;

  const previewElement = cardPreviewTemplate.content
    .querySelector<HTMLElement>(".card")!
    .cloneNode(true) as HTMLElement;
  const preview = new CardPreview(previewElement, {
    onClick: () => {
      if (item.price === null) {
        return;
      }
      cart.addItem(item);
    },
  });

  preview.title = item.title;
  preview.price = item.price;
  preview.image = CDN_URL + item.image;
  preview.category = item.category;
  preview.description = item.description;
  modal.content = previewElement;

  modal.open();
});
events.on<{ items: IProduct[] }>("cart:changed", (data) => {
  header.counter = data.items.length;
  const basketItems = data.items.map((item, index) => {
    const basketItemElement = cardBasketTemplate.content
      .querySelector<HTMLElement>(".basket__item")!
      .cloneNode(true) as HTMLElement;
    const card = new CardBasket(basketItemElement, {
      onClick: () => {
        cart.removeItem(item.id);
      },
    });
    card.title = item.title;
    card.price = item.price ?? 0;
    card.index = index + 1;
    return basketItemElement;
  });
  basket.items = basketItems;
  basket.total = cart.getTotal();
});

api.get<{ items: IProduct[] }>("/product/").then((data) => {
  catalog.setItems(data.items);
});
