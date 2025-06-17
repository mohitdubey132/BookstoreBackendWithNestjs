import { Test, TestingModule } from '@nestjs/testing';
import { OrderAndProductController } from './order_and_product.controller';
import { OrderAndProductService } from './order_and_product.service';

describe('OrderAndProductController', () => {
  let orderAndProductController: OrderAndProductController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderAndProductController],
      providers: [OrderAndProductService],
    }).compile();

    orderAndProductController = app.get<OrderAndProductController>(
      OrderAndProductController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderAndProductController.getHello()).toBe('Hello World!');
    });
  });
});
