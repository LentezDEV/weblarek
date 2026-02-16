import type {
  IApi,
  IOrder,
  IOrderResult,
  IProduct,
  IProductsResponse,
} from '../types';

export class WebLarekApi {
  constructor(private readonly api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api
      .get<IProductsResponse>('/product/')
      .then((response) => response.items);
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', order);
  }
}
