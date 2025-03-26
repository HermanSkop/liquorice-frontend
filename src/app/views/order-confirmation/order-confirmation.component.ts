import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {OrderResponseDto} from '../../dtos/order-response.dto';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  imports: [
    NgIf,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    NgForOf
  ],
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  order: OrderResponseDto | null = null;

  constructor(private router: Router) {
  }

  ngOnInit() {
    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
      this.order = JSON.parse(orderData);
      sessionStorage.removeItem('orderData');
    } else {
      this.router.navigate(['/']);
    }
  }
}
