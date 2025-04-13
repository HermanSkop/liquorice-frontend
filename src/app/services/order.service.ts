import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {apiUrl} from '../app.config';
import {OrderResponseDto} from '../dtos/order-response.dto';
import {ClientIntentResponseDto} from '../dtos/client-intent-response.dto';
import {AddressDto} from '../dtos/address.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {
  }

  /**
   * Create a payment intent for the order
   * @returns Client secret for the payment intent
   */
  createOrder(address: AddressDto) {
    return this.http.post<ClientIntentResponseDto>(`${apiUrl}/orders`, address);
  }

  getPaymentIntentForOrder(orderId: string) {
    return this.http.get<ClientIntentResponseDto>(`${apiUrl}/orders/${orderId}/payment-intent`);
  }

  getAllOrders() {
    return this.http.get<OrderResponseDto[]>(`${apiUrl}/orders`);
  }

  refundOrder(orderId: string) {
    return this.http.patch<OrderResponseDto>(`${apiUrl}/orders/${orderId}/refund`, {});
  }

  getAllOrdersForCustomer(customerId: string) {
    let params = new HttpParams()
      .set('customerId', customerId);
    return this.http.get<OrderResponseDto[]>(`${apiUrl}/orders`, {params});
  }
}
