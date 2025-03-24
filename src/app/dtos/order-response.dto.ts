import {OrderItemDto} from './order-item.dto';

export class OrderResponseDto {
  constructor(
    public id: string,
    public createdDate: string,
    public totalAmount: number,
    public status: string,
    public orderItems: OrderItemDto[],
    public estimatedDeliveryDate: string,
  ) {
  }
}
