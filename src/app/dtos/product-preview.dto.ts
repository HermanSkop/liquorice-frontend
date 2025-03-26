export class ProductPreviewDto {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public image: string | null,
    public amountLeft: number,
    public categories: string[],
  ) {
  }
}
