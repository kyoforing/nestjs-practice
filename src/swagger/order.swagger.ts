import { ApiProperty } from '@nestjs/swagger';
import * as CommonApiDocs from '../swagger/common.swagger';

export class Order {
  @ApiProperty({ description: 'order ID' })
  id: number;

  @ApiProperty({ description: 'user ID' })
  userId: string;

  @ApiProperty({ description: 'user name' })
  name: string;

  @ApiProperty({ description: 'order name' })
  plateNo: string;

  @ApiProperty({ description: 'order status. rented or completed' })
  status: string;
  
  @ApiProperty({ description: 'create time of order' })
  createTime: number;
  
  @ApiProperty({ description: 'last update time of order' })
  updateTime: number;
}

class OrderList {
  @ApiProperty({ description: 'page information' })
  page: CommonApiDocs.PageInfo;

  @ApiProperty({ description: 'scooter list', type: [Order] })
  list: Order[];
}

export const OrderID = {
  name: "id",
  description: "Order ID",
  required: true,
  type: Number
};

export class GetOrdersResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'Order List' })
  data: OrderList;
}

export class GetOrderResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'Order information' })
  data: Order;
}

export class CreateOrderResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'Order' })
  data: Order;
}

export class CompleteOrderResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'OK' })
  data: string;
}