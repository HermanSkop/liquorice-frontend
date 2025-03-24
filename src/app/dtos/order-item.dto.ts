import {ProductPreviewDto} from './product-preview.dto';

export class OrderItemDto {
  constructor(
    public product: ProductPreviewDto,
    public quantity: number,
  ) {
  }
}
