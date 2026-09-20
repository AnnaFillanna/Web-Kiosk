# Web Kiosk

An educational Web Kiosk online store project implemented in TypeScript.

The application allows users to browse the product catalog, open detailed product information, add products to the cart, complete the checkout process in two steps, and submit the order to the server.

## Tech Stack

- TypeScript
- Vite
- HTML
- SCSS
- REST API
- npm

## Installation and Setup

Node.js and npm are required.

Install dependencies:

```bash
npm install
```

Start the project in development mode:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the built version locally:

```bash
npm run preview
```

## Architecture

The application is built using the MVP (Model–View–Presenter) architectural pattern with event-driven interaction between components through an Event Broker.

## Data Model Diagram

![Data types and models diagram](docs/architecture.jpg)

### Model

The models store the application state and implement the business logic:

- `Catalog` — stores the product catalog and the selected product;
- `Cart` — manages products in the cart;
- `Buyer` — stores customer data and validates it.

When the state changes, the models emit events through the Event Broker.

### View

View components are responsible for displaying data and user interaction with the interface.

Common functionality of the View components is implemented in the base `Component` class.

### Presenter

The role of the Presenter is performed by the application entry point `main.ts`.

The Presenter does not store the application state itself. It coordinates interaction between components: receives events from the Views, calls the required model methods, reacts to changes in the model state, and passes updated data to the View components.

The Presenter also coordinates retrieving the catalog and submitting the order through the API.

Main responsibilities of the Presenter:

- creates instances of models and View components;
- subscribes to Event Broker events;
- reacts to user actions;
- calls model methods to change the state;
- reacts to model change events;
- passes data from models to View components;
- updates the interface;
- coordinates interaction with the API;
- creates and submits the order to the server.

### Event Broker

The Event Broker provides loose coupling between application components.

Models and Views do not call each other directly. Instead, they emit events that the Presenter subscribes to.

## Main Application Flow

1. The product catalog is loaded from the server.
2. The received products are stored in the `Catalog` model.
3. The catalog is displayed to the user.
4. When a product is selected, a modal window with detailed information opens.
5. A product with an available price can be added to the cart.
6. The cart displays the selected products and the total price, while the Header displays the number of products.
7. The user proceeds to checkout.
8. At the first step, the payment method is selected and the delivery address is entered.
9. At the second step, the user enters an email address and phone number.
10. The `Buyer` model checks whether the required data has been filled in.
11. An order is created based on the customer data and the cart.
12. The order is sent to the server.
13. After successful checkout, information about the successful purchase is displayed.
14. The cart and customer data are cleared to allow a new order to be placed, and the Views are updated through model change events.

Products without a specified price (`price: null`) cannot be added to the cart.

## Data and Types

The main application types describe products, customer data, and the objects exchanged between the application and the server.

### `TPayment`

Supported payment methods:

```ts
type TPayment = 'card' | 'cash';
```

An empty string is used as the initial payment method value until the user makes a selection.

### `IProduct`

Describes a product in the online store:

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

- `id` — unique product identifier;
- `description` — product description;
- `image` — path to the image;
- `title` — product title;
- `category` — product category;
- `price` — product price or `null` if the product cannot be purchased.

### `IBuyer`

Describes customer data:

```ts
interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
```

### `TBuyerErrors`

Describes errors in the customer data:

```ts
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;
```

### `IProductsResponse`

Describes the server response when retrieving the catalog:

```ts
interface IProductsResponse {
  total: number;
  items: IProduct[];
}
```

### `IOrder`

Describes the order sent to the server:

```ts
interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

The `items` field contains the identifiers of the products included in the order.

### `IOrderResponse`

Describes the server response after successful checkout:

```ts
interface IOrderResponse {
  id: string;
  total: number;
}
```

## Data Models

### `Catalog`

The catalog model stores the list of products and the product selected by the user.

Main methods:

- `setItems()` — stores the product catalog;
- `getItems()` — returns the catalog;
- `getItem()` — returns a product by its identifier;
- `setSelectedProduct()` — stores the selected product;
- `getSelectedProduct()` — returns the selected product.

When the data changes, the model reports it through the Event Broker.

### `Cart`

The cart model stores the products selected by the user.

Main methods:

- `getItems()` — returns the products in the cart;
- `addItem()` — adds a product;
- `removeItem()` — removes a product;
- `clear()` — clears the cart;
- `getTotal()` — calculates the total price;
- `getCount()` — returns the number of products;
- `hasItem()` — checks whether a product is present in the cart.

After the cart contents change, the model emits the `cart:changed` event.

### `Buyer`

The customer model stores the data required to place an order.

Main methods:

- `setData()` — updates customer data;
- `getData()` — returns the current data;
- `clear()` — clears the data;
- `validate()` — checks whether the required fields are filled in.

When the customer data changes, the model reports it through the Event Broker, allowing the form state and error messages to be updated in the interface.

## View Components

### `Component`

Base abstract class for View components.

Contains common functionality for working with DOM elements.

Main methods:

- `setImage()` — sets the image and alternative text;
- `render()` — updates the component data and returns its root DOM element.

### `Gallery`

Responsible for displaying the product catalog.

Main functionality:

- receives an array of card DOM elements;
- displays product cards in the catalog container.

### `Card`

Base View class for a product card.

Main functionality:

- displays the product title;
- displays the product price.

Used as the parent class for specialized cards.

### `CardCatalog`

Represents a product card in the catalog.

Main functionality:

- displays the product title, price, and image;
- handles the user's click on the card;
- calls the provided user action handler.

### `CardPreview`

Represents detailed information about the selected product.

Main functionality:

- displays the product image and its alternative description;
- displays the category and description;
- displays the product title and price;
- handles the user's click on the product action button;
- calls the provided user action handler.

The decision to add or remove a product from the cart is made by the Presenter based on the current state of the `Cart` model.

### `CardBasket`

Represents an individual product in the cart.

Main functionality:

- displays the product title and price;
- displays the product's position number;
- handles the user's click on the remove button;
- calls the provided user action handler.

### `Basket`

Responsible for displaying the cart.

Main functionality:

- displays the list of products;
- displays the total order price;
- controls the state of the checkout button.

### `Header`

Responsible for displaying the cart state in the page header.

Main functionality:

- displays the number of products in the cart;
- handles the user action for opening the cart.

### `Modal`

Controls the application's modal window.

Main functionality:

- sets the content of the modal window;
- opens the modal window;
- closes the modal window;
- handles the user closing the window.

### `Form`

Base View class for a form.

Main functionality:

- handles user data input;
- emits field change and form submission events;
- controls the state of the submit button;
- displays error messages.

### `OrderForm`

Represents the first step of the checkout process.

Main functionality:

- displays and updates the delivery address;
- displays the selected payment method;
- handles the user's selection of the payment method.

### `ContactsForm`

Represents the second step of the checkout process.

Main functionality:

- displays and updates the customer's email;
- displays and updates the phone number.

### `Success`

Represents the successful order confirmation message.

Main functionality:

- displays the final order price;
- handles closing the successful purchase message.

## API Integration

The base `Api` class and the `KioskApi` class are used to interact with the server, providing methods for working with the online store API.

Main application operations:

```text
GET /product/
```

Retrieving the product catalog.

```text
POST /order/
```

Submitting the completed order.

The application models do not perform HTTP requests themselves. Interaction with the API is coordinated by the Presenter in `main.ts` through an instance of `KioskApi`.

## Separation of Responsibilities

The application architecture separates responsibilities between layers:

- Model stores the state and business logic;
- View is responsible for displaying data and user actions;
- Presenter coordinates interaction between Model, View, and API;
- Event Broker provides event-driven interaction between components;
- `Api` and `KioskApi` are responsible for interaction with the server.

This separation reduces coupling between components and allows the presentation, business logic, and network interaction to be changed independently of each other.