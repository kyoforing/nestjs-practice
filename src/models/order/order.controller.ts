import { Controller, Get, Post, Put, Query, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { ResponseHepler, ResponseFormat } from '../../helper/format';
import { ApiParam, ApiResponse, ApiCreatedResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import * as OrderApiDocs from '../../swagger/order.swagger';
import * as CommonApiDocs from '../../swagger/common.swagger';

const successStatusCode = () => 200;

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiTags('Order')
  @ApiQuery(CommonApiDocs.PageParam)
  @ApiQuery(CommonApiDocs.LimitParam)
  @ApiQuery(CommonApiDocs.QueryParam)
  @ApiResponse({ status: 200, description: 'Order list', type: OrderApiDocs.GetOrdersResponse })
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  @Get('/v1/api/orders')
  async getOrders(@Query() params): Promise<ResponseFormat> {
    const orders = await this.orderService.getOrders(params);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(orders);
  }

  @Get('/v1/api/order/:id')
  @ApiTags('Order')
  @ApiParam(OrderApiDocs.OrderID)
  @ApiResponse({ status: 200, description: 'Order list', type: OrderApiDocs.GetOrderResponse })
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async getOrder(@Param() params): Promise<ResponseFormat> {
    const order = await this.orderService.getOrder(params.id);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(order);
  }

  @Post('/v1/api/order')
  @ApiTags('Order')
  @ApiBody({ type: OrderApiDocs.CreateOrderDto })
  @ApiCreatedResponse({ description: 'The order has been successfully created.', type: OrderApiDocs.CreateOrderResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async addOrder(@Body() body): Promise<ResponseFormat> {
    const order = await this.orderService.addOrder(body);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(order);
  }

  @Put('/v1/api/order/:id/completion')
  @ApiTags('Order')
  @ApiParam(OrderApiDocs.OrderID)
  @ApiResponse({ status: 200, description: 'OK', type: OrderApiDocs.CompleteOrderResponse })
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async completeOrder(@Param() params): Promise<ResponseFormat> {
    await this.orderService.completeOrder(params.id);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response('OK');
  }
}

