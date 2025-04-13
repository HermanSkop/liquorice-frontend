import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {apiUrl} from '../app.config';
import {PaymentRequestDto} from '../dtos/payment-request.dto';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {
  }

  payOrder(paymentRequest: PaymentRequestDto) {
    return this.http.post<void>(`${apiUrl}/payments/paid`, paymentRequest);
  }
}
