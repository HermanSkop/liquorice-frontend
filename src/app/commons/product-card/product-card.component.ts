import {Component, Input, OnInit} from '@angular/core';
import {ProductPreviewDto} from '../../dtos/product-preview.dto';
import {CartService} from '../../services/cart.service';
import {NgForOf, NgIf} from '@angular/common';
import {ProductService} from '../../services/product.service';
import {AuthenticatorService} from '../../services/authenticator.service';
import {FormsModule} from '@angular/forms';
import {Role} from '../../dtos/role';

@Component({
  selector: 'app-product-card',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: ProductPreviewDto;
  @Input() isSingleColumn: boolean = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    public authService: AuthenticatorService
  ) {
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }

  isValidBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  toggleAvailability(event: Event): void {
    const available = (event.target as HTMLInputElement).checked;

    this.productService.updateProductAvailability(this.product.id, available)
      .subscribe({
        next: () => {
          this.product.available = available;
        },
        error: (error: any) => {
          console.error('Failed to update product availability', error);
          (event.target as HTMLInputElement).checked = !available;
        }
      });
  }

  protected readonly Role = Role;
}
