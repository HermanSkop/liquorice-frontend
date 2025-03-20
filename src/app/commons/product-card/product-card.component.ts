import {Component, Input} from '@angular/core';
import {ProductPreviewDto} from '../../dtos/product-preview.dto';
import {CartService} from '../../services/cart.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [
    NgForOf
  ],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: ProductPreviewDto;
  @Input() isSingleColumn: boolean = false;

  constructor(private cartService: CartService) {
  }

  addToCart(): void {
    console.log(this.product);
    this.cartService.addToCart(this.product);
  }

  isValidBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }
}
