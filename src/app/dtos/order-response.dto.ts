import {OrderItemDto} from './order-item.dto';
import {AddressDto} from './address.dto';

export class OrderResponseDto {
  constructor(
    public id: string,
    public createdDate: string,
    public totalAmount: number,
    public status: Status,
    public orderItems: OrderItemDto[],
    public estimatedDeliveryDate: string,
    public deliveryAddress: AddressDto
  ) {
  }
}

export enum Status {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  ANNULLED = 'ANNULLED',
  REFUNDED = 'REFUNDED'
}
