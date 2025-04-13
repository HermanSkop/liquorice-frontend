import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {OrderResponseDto, Status} from '../../dtos/order-response.dto';
import {AuthenticatorService} from '../../services/authenticator.service';
import {Role} from '../../dtos/role';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.css'
})
export class OrderViewComponent implements OnInit, OnDestroy {
  orders: OrderResponseDto[] = [];
  loading = false;
  errorMessage = '';
  userIdFilter = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private router: Router,
    public authService: AuthenticatorService
  ) {
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.fetchOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.fetchOrders());
  }

  fetchOrders() {
    this.loading = true;
    this.errorMessage = '';

    let observable: Observable<OrderResponseDto[]>;

    if (this.authService.hasRole(Role.ADMIN) && this.userIdFilter) {
      observable = this.orderService.getAllOrdersForCustomer(this.userIdFilter)
    } else {
      observable = this.orderService.getAllOrders();
    }

    observable.subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching orders', error);
        this.errorMessage = 'Failed to load orders for this user.';
        this.loading = false;
      }
    });
  }

  filterOrders() {
    this.searchSubject.next(this.userIdFilter);
  }

  clearFilter() {
    this.userIdFilter = '';
    this.fetchOrders();
  }

  // Other existing methods remain unchanged
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
      next: response => {
        sessionStorage.setItem('clientSecret', response.clientSecret);
        sessionStorage.setItem('orderRequestDto', JSON.stringify({orderId}));
        this.router.navigate(['/payment', orderId]);
      },
      error: error => {
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
      error: error => {
        console.error('Error refunding order', error);
        this.errorMessage = 'Unable to process refund for this order.';
        this.loading = false;
      }
    });
  }

  protected readonly Role = Role;
  protected readonly Status = Status;
}
