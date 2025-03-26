export class AddressDto {
  constructor(
    public city: string,
    public country: string = 'US',
    public line1: string,
    public line2: string,
    public postalCode: string,
    public state: string
  ) {
  }
}
