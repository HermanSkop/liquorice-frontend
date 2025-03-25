import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {OrderResponseDto, Status} from '../../dtos/order-response.dto';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.css'
})
export class OrderViewComponent implements OnInit {
  orders: OrderResponseDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.orderService.getCustomerOrders().subscribe({
      next: (orders) => {
        console.log(orders);
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching orders', error);
        this.errorMessage = 'Failed to load your orders. Please try again later.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case Status.DELIVERED:
        return 'bg-success';
      case Status.CREATED:
        return 'bg-warning';
      case Status.ANNULLED:
        return 'bg-danger';
      case Status.REFUNDED:
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  formatDate(date: string): string {
    return formatDate(date, 'MMM d, y, h:mm a', 'en-US');
  }

  continuePayment(orderId: string) {
    this.loading = true;

    this.orderService.getPaymentIntentForOrder(orderId).subscribe({
      next: (response) => {
        sessionStorage.setItem('clientSecret', response.clientSecret);

        const orderRequest = {orderId};
        sessionStorage.setItem('orderRequestDto', JSON.stringify(orderRequest));

        this.router.navigate(['/payment', orderId]);
      },
      error: (error) => {
        console.error('Error getting payment intent', error);
        this.errorMessage = 'Unable to process payment for this order.';
        this.loading = false;
      }
    });
  }
}
