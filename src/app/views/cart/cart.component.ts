import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthenticatorService} from '../../services/authenticator.service';
import {CartItemDto} from '../../dtos/cart-item.dto';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [
    NgIf,
    RouterLink,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItemDto[] = [];
  cartTotal: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private authService: AuthenticatorService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: CartItemDto[]) => {
        this.cartItems = items;
        this.cartTotal = this.cartService.getCartTotal();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(productId: string, event: Event): void {
    const quantity = parseInt((event.target as HTMLInputElement).value);
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    } else {
      this.removeItem(productId);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
