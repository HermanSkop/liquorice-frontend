export interface CartRequestDto {
  productQuantities: { [productId: string]: number };
}
