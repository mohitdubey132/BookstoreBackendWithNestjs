import { Body, Controller, Get, Inject } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError, timeout } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  @Get('/orders/test')
  async getOrderTest(@Body() data: any) {
    const result = this.orderClient.send('create_order', data).pipe(
      timeout(6000),
      catchError((err) => {
        console.error('Microservice error or timeout:', err.message);
        return throwError(
          () =>
            new Error('Order Service is unavailable. Please try again later.'),
        );
      }),
    );
    return result;
  }
}
