import "./scss/styles.scss";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/Card/CardCatalog";
import { CardPreview } from "./components/views/Card/CardPreview";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { IProduct, TPayment, IOrder } from "./types";
import { Api } from "./components/base/Api";
import { KioskApi } from "./components/KioskApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { CardBasket } from "./components/views/Card/CardBasket";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Success } from "./components/views/Success";
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
const kioskApi = new KioskApi(api);
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);
const modal = new Modal(modalElement);
const previewElement = cardPreviewTemplate.content
  .querySelector<HTMLElement>(".card")!
  .cloneNode(true) as HTMLElement;

const preview = new CardPreview(previewElement, {
  onClick: () => {
    events.emit("preview:action");
  },
});

events.on("preview:action", () => {
  const item = catalog.getSelectedProduct();

  if (!item || item.price === null) {
    return;
  }

  if (cart.hasItem(item.id)) {
    cart.removeItem(item.id);
  } else {
    cart.addItem(item);
  }
  modal.close();
});
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

const success = new Success(successElement, {
  onClick: () => {
    events.emit("success:close");
  },
});

events.on("success:close", () => {
  modal.close();
});

const basket = new Basket(basketElement, {
  onClick: () => {
    events.emit("order:open");
  },
});

events.on("order:open", () => {
  modal.content = orderElement;
  modal.open();
});

const header = new Header(headerElement, () => {
  events.emit("basket:open");
});

events.on("basket:open", () => {
  modal.content = basketElement;
  modal.open();
});

const orderForm = new OrderForm(orderElement, events);
const contactsElement = contactsTemplate.content
  .querySelector<HTMLFormElement>(".form")!
  .cloneNode(true) as HTMLFormElement;

const contactsForm = new ContactsForm(contactsElement, events);
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
  const buyerData = buyer.getData();

  orderForm.address = buyerData.address;
  orderForm.payment = buyerData.payment || null;
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;

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
  const order: IOrder = {
    payment: buyerData.payment as TPayment,
    address: buyerData.address,
    email: buyerData.email,
    phone: buyerData.phone,
    total: cart.getTotal(),
    items: cart.getItems().map((item) => item.id),
  };

  kioskApi
    .postOrder(order)
    .then((result) => {
      success.total = result.total;

      cart.clear();
      buyer.clear();
      modal.content = successElement;
      modal.open();
    })
    .catch((error) => {
      console.error("Order error:", error);
    });
});

events.on<{ items: IProduct[] }>("items:changed", (data) => {
  const cards = data.items.map((item) => {
    const cardElement = cardCatalogTemplate.content
      .querySelector<HTMLElement>(".card")!
      .cloneNode(true) as HTMLElement;

    const card = new CardCatalog(cardElement, {
      onClick: () => {
        events.emit("card:select", { item });
      },
    });

    card.title = item.title;
    card.price = item.price;
    card.image = item.image;
    return cardElement;
  });
  gallery.catalog = cards;
});
events.on<{ item: IProduct }>("card:select", (data) => {
  catalog.setSelectedProduct(data.item);
});
events.on<{ product: IProduct }>("product:selected", (data) => {
  const item = data.product;
  preview.title = item.title;
  preview.price = item.price;
  preview.image = item.image;
  preview.imageAlt = item.title;
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
        events.emit("basket:remove", { id: item.id });
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
events.on<{ id: string }>("basket:remove", (data) => {
  cart.removeItem(data.id);
});
const productTranslations: Record<
  string,
  { title: string; description: string; category: string }
> = {
  "854cef69-976d-4c2a-a18c-2aa45046c390": {
    title: "+1 hour a day",
    description: "If you're planning to solve tasks in the trainer, take two.",
    category: "soft skill",
  },
  "c101ab44-ed99-4a54-990d-47aa2bb4e7d9": {
    title: "HEX Lollipop",
    description:
      "Lick this lollipop to instantly remember and recognize any CSS color code.",
    category: "other",
  },
  "b06cde61-912f-4663-9751-09956c0eed67": {
    title: "Mom Timer",
    description:
      "It will keep an eye on you and stop you from procrastinating.",
    category: "soft skill",
  },
  "412bcf81-7e75-4e70-bdb9-d3c73c9803b7": {
    title: "Framework Fortune Cookies",
    description:
      "Open these cookies to find out which framework you should learn next.",
    category: "additional",
  },
  "1c521d84-c48d-48fa-8cfb-9d911fa515fd": {
  title: "Mute the Cat Button",
  description: "If the cat is yelling, press the button.",
  category: "button",
},
"f3867296-45c7-4603-bd34-29cea3a061d5": {
  title: "BEM Pill",
  description:
    "To learn how to name modifiers correctly — you can't do without this.",
  category: "other",
},
"54df7dcb-1213-4b3c-ab61-92ed5f845535": {
  title: "Portable Teleporter",
  description: "Change your location to search for a job.",
  category: "other",
},
"6a834fb8-350a-440c-ab55-d0e9b959b6e3": {
  title: "Pocket Micro-Universe",
  description: "Gives you time to learn React, OOP, and backend development.",
  category: "other",
},
"48e86fc0-ca99-4e13-b164-b98d65928b53": {
  title: "UI/UX Pencil",
  description: "A very useful skill for a frontend developer. No kidding.",
  category: "hard skill",
},
"90973ae5-285c-4b6f-a6d0-65d1d760b102": {
  title: "Backend Anti-Stress",
  description: "Squeeze the ball to reduce stress from backend development.",
  category: "other",
},
};
kioskApi
  .getProducts()
  .then((data) => {
    console.log(data.items);
    const items = data.items.map((item) => {
      const translation = productTranslations[item.id];

      return {
        ...item,
        ...(translation ?? {}),
        image: CDN_URL + item.image,
      };
    });

    catalog.setItems(items);
  })
  .catch((error) => {
    console.error("Products loading error:", error);
  });
