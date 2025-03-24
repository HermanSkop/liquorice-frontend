import {AddressDto} from './address.dto';

export class OrderRequestDto {
  constructor(
    public address: AddressDto,
    public orderId: string,
    ) {
  }
}
