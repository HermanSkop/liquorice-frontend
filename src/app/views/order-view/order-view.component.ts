import {Component, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {OrderResponseDto, Status} from '../../dtos/order-response.dto';
import {AuthenticatorService} from '../../services/authenticator.service';
import {Role} from '../../dtos/role';

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
    private router: Router,
    public authService: AuthenticatorService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    let fetchingFunction;
    if (this.authService.hasRole(Role.ADMIN)) {
      fetchingFunction = this.orderService.getAllOrders.bind(this.orderService);
    } else {
      fetchingFunction = this.orderService.getCustomerOrders.bind(this.orderService);
    }
    fetchingFunction().subscribe({
      next: (orders: OrderResponseDto[]) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error: any) => {
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

  refundOrder(orderId: string) {
    this.loading = true;

    this.orderService.refundOrder(orderId).subscribe({
      next: () => {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = Status.REFUNDED;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error refunding order', error);
        this.errorMessage = 'Unable to process refund for this order.';
        this.loading = false;
      }
    });
  }

  protected readonly Role = Role;
  protected readonly Status = Status;
}
