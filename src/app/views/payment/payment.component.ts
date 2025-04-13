import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {CartService} from '../../services/cart.service';
import {stripePublicKey} from '../../app.config';
import {PaymentService} from '../../services/payment.service';
import {PaymentRequestDto} from '../../dtos/payment-request.dto';

@Component({
  selector: 'app-payment',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentRequestDto: PaymentRequestDto | null = null;
  clientSecret: string = '';
  loading = false;
  paymentError = '';
  stripePromise = loadStripe(stripePublicKey);
  private stripe: Stripe | null = null;
  private cardElement: any;

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    const orderRequestDtoJson = sessionStorage.getItem('orderRequestDto');
    this.clientSecret = sessionStorage.getItem('clientSecret') || '';
    if (orderRequestDtoJson && this.clientSecret) {
      this.paymentRequestDto = JSON.parse(orderRequestDtoJson);
    } else {
      this.router.navigate(['/checkout']);
      return;
    }

    this.stripe = await this.stripePromise;
    if (this.stripe) {
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card');
      this.cardElement.mount('#card-element');
    }
  }

  processPayment() {
    if (!this.stripe || !this.cardElement || !this.paymentRequestDto) {
      return;
    }

    this.loading = true;
    this.stripe!.confirmCardPayment(this.clientSecret, {
      payment_method: {card: this.cardElement}
    }).then(result => {
      if (result.error) {
        this.paymentError = result.error.message || 'Payment failed';
        this.loading = false;
      } else if (result.paymentIntent.status === 'succeeded') {
        this.completeOrder();
      }
    });
  }

  private completeOrder() {
    if (!this.paymentRequestDto)
      throw new Error('PaymentRequestDto is not set');

    this.paymentService.payOrder(this.paymentRequestDto).subscribe({
      next: () => {
        this.cartService.clearCart();
        sessionStorage.removeItem('pendingOrder');
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.paymentError = 'Payment was processed but failed to complete the order';
        this.loading = false;
      }
    });
  }
}
