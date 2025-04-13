export class ClientIntentResponseDto {
  constructor(
    public clientSecret: string,
    public intentId: string,
    public orderId: string
  ) {
  }
}
