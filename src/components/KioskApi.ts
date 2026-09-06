import {
  IApi,
  IProductsResponse,
  IOrder,
  IOrderResponse,
} from '../types';

export class KioskApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}