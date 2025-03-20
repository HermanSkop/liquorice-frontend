import {ProductPreviewDto} from './product-preview.dto';

export class CartItemDto {
  constructor(
    public product: ProductPreviewDto,
    public quantity: number) {
  }
}
