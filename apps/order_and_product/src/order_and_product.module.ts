import { Module } from '@nestjs/common';
import { OrderAndProductController } from './order_and_product.controller';
import { OrderAndProductService } from './order_and_product.service';

@Module({
  imports: [],
  controllers: [OrderAndProductController],
  providers: [OrderAndProductService],
})
export class OrderAndProductModule {}
