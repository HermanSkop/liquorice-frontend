export class ProductPreviewDto {
  constructor(
    public name: string,
    public price: number,
    public image: string | null,
    public categories: {id: number, name: string}[]
  ) {}
}
