import { Component, Input } from '@angular/core';
import {ProductPreviewDto} from '../../dtos/product-preview.dto';
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

  isValidBase64(str: string | null): boolean {
    if (!str) return false;
    if (str.startsWith('[B@')) return false;
    return /^[A-Za-z0-9+/=]+$/.test(str);
  }
}
