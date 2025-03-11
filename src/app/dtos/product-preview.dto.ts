export class ProductPreviewDto {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public image: string | null,
    public amountLeft: number,
    public categories: {id: number, name: string}[]
  ) {}
}
