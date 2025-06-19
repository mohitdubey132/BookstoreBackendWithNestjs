import { Controller, Inject } from '@nestjs/common';
import { OrderAndProductService } from './order_and_product.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFullOrderDTO, ProductQueryDTO } from './dto';
import { validatePayload } from './utils/validate';
import { catchError, throwError, timeout } from 'rxjs';

@Controller()
export class OrderAndProductController {
  constructor(
    private readonly orderAndProductService: OrderAndProductService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}
  @MessagePattern('create_order')
  async handleOrder(data: CreateFullOrderDTO) {
    if (data.customerId) {
      const result = this.userClient.send('verifyToken', data.customerId).pipe(
        timeout(6000),
        catchError((err) => {
          console.error('Microservice error or timeout:', err.message);
          return throwError(
            () =>
              new Error(
                'Order Service is unavailable. Please try again later.',
              ),
          );
        }),
      );
      console.log(result);
      return result;
    }
    return { success: true, message: 'Order Created' };
  }

  @MessagePattern('getProducts')
  async fetchProducts() {
    const res = await this.orderAndProductService.fetchProducts();

    return res;
  }
  @MessagePattern('getProducts1')
  async fetchProducts1(@Payload() query: ProductQueryDTO) {
    let reserror: any;
    const validData = await validatePayload(ProductQueryDTO, query)
      .then()
      .catch((err) => {
        reserror = err.response;
      });
    const res = await this.orderAndProductService.fetchProducts1(query);

    return reserror ?? res;
  }
}
