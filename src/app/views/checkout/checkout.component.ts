import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CartService} from '../../services/cart.service';
import {OrderService} from '../../services/order.service';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {PaymentRequestDto} from '../../dtos/payment-request.dto';
import {AddressDto} from '../../dtos/address.dto';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    DecimalPipe,
    AsyncPipe
  ],
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  addressForm: FormGroup;
  cartTotal = 0;
  loading = false;
  orderError = '';

  constructor(
    private fb: FormBuilder,
    protected cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(-[0-9]{4})?$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  async ngOnInit() {
    this.cartTotal = this.cartService.getCartTotal();
    this.populateTestData();
  }

  private populateTestData() {
    if (location.hostname === 'localhost') {
      this.addressForm.patchValue({
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        phone: '1234567890'
      });

      // 4242 4242 4242 4242 - Success
      // 4000 0000 0000 0002 - Declined
    }
  }

  createOrder() {
    if (this.addressForm.invalid) {
      return;
    }

    this.loading = true;
    this.createPaymentIntent();
  }

  private createPaymentIntent() {
    const formValues = this.addressForm.value;

    const addressDto = new AddressDto(
      formValues.city,
      'US',
      formValues.addressLine1,
      formValues.addressLine2 || '',
      formValues.postalCode,
      formValues.state
    );

    this.orderService.createOrder(addressDto).subscribe({
      next: (clientIntentResponse) => {

        sessionStorage.setItem('orderRequestDto', JSON.stringify(new PaymentRequestDto(clientIntentResponse.orderId)));
        sessionStorage.setItem('clientSecret', clientIntentResponse.clientSecret);
        this.router.navigate([`/payment/${clientIntentResponse.orderId}`]);
      },
      error: this.handlePaymentIntentError.bind(this)
    });
  }

  private handlePaymentIntentError(error: any) {
    this.orderError = 'An error occurred creating payment intent';
    console.error(error);
    this.loading = false;
  }
}
