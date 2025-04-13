import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {CartResponseDto} from '../dtos/cart-response.dto';
import {CartRequestDto} from '../dtos/cart-request.dto';
import {CartItemDto} from '../dtos/cart-item.dto';
import {apiUrl} from '../app.config';
import {ProductPreviewDto} from '../dtos/product-preview.dto';
import {AuthenticatorService} from './authenticator.service';
import {Role} from '../dtos/role';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItemDto[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private authenticatorService: AuthenticatorService) {
    this.authenticatorService.authStateChanged.subscribe(authStateChanged => {
      console.log('Auth state changed', authStateChanged);
      if (authStateChanged && authenticatorService.hasRole(Role.CUSTOMER)) {
        this.loadCart();
      }
    });
  }

  private loadCart(): void {
    this.http.get<CartResponseDto>(`${apiUrl}/cart`)
      .subscribe({
        next: (response) => {
          console.log('cart', response);
          this.cartSubject.next(response.cartItems);
        },
        error: (error) => {
          console.error(error);
          this.cartSubject.next([]);
        }
      });
  }

  addToCart(product: ProductPreviewDto, quantity: number = 1): void {
    if (this.cartSubject.value.some((item: CartItemDto) => item.product.id === product.id)) {
      console.log('quantity', product.id, quantity);
      this.addQuantity(product.id, quantity);
      return;
    }
    this.cartSubject.value.push(new CartItemDto(product, quantity));

    this.updateCart()
  }

  updateCart(): void {
    const request: CartRequestDto = {
      productQuantities: {}
    };

    this.cartSubject.value.forEach(item => {
      console.log('item', item);
      request.productQuantities[item.product.id] = item.quantity;
    });

    this.http.post<CartResponseDto>(`${apiUrl}/cart`, request).subscribe({
      next: (response) => {
        console.log('Updated cart:', response);
        this.cartSubject.next(response.cartItems);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartSubject.value.find(item => item.product.id === productId);
    if (!item) return;
    item.quantity = quantity;
    this.updateCart();
  }

  addQuantity(productId: string, quantity: number): void {
    const item = this.cartSubject.value.find(item => item.product.id === productId);
    if (!item) return;
    item.quantity += quantity;
    this.updateCart();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartSubject.value;
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex === -1) return;

    currentItems.splice(itemIndex, 1);

    this.updateCart();
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.updateCart();
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce((total, item) =>
      total + (item.product.price * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cartSubject.value.reduce((count, item) =>
      count + item.quantity, 0);
  }
}
