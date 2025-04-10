import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {apiUrl} from '../app.config';
import {OrderRequestDto} from '../dtos/order-request.dto';
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

  /**
   * Complete the order after payment is successful
   * @param orderRequest Order request DTO
   * @returns Order response DTO
   */
  completeOrder(orderRequest: OrderRequestDto) {
    return this.http.post<OrderResponseDto>(`${apiUrl}/orders/complete`, orderRequest);
  }

  /**
   * Get all orders for the authenticated customer
   * @returns List of order response DTOs
   */
  getCustomerOrders() {
    return this.http.get<OrderResponseDto[]>(`${apiUrl}/customers/orders`);
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

  getAllOrdersForCustomer(userId?: string) {
      return this.http.get<OrderResponseDto[]>(`${apiUrl}/customers/${userId}/orders`);
  }
}
