import { Controller } from '@nestjs/common';
import { OrderAndProductService } from './order_and_product.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class OrderAndProductController {
  constructor(
    private readonly orderAndProductService: OrderAndProductService,
  ) {}
  @MessagePattern('create_order')
  async handleOrder(data: any) {
    // const createdOrder = await this.orderService.createOrder(data);
    console.log(data);

    return { success: true, message: 'Order Created' };
  }
}
