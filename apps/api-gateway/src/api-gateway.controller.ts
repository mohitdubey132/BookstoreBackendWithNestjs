import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError, timeout } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('/orders/test')
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

  @Post('/user')
  async creatUser(@Body() data: any) {
    const result = this.userClient.send('create_user', data).pipe(
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
  // login
  @Post('/login')
  async loginUser(@Body() data: any) {
    const result = this.userClient.send('login', data).pipe(
      timeout(6000),
      catchError((err) => {
        console.error('Microservice error or timeout:', err.message);
        return throwError(() => new Error(' Please try again later.'));
      }),
    );
    return result;
  }
  @Post('/varify')
  async verifytoek(@Body() body: { token: string }) {
    const result = this.userClient.send('verifyToken', body.token).pipe(
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
  @Get('/products')
  async getAllProducts() {
    const result = this.orderClient.send('getProducts', {}).pipe(
      timeout(6000),
      catchError((err) => {
        console.error('Microservice error or timeout:', err.message);
        return throwError(() => new Error(' Please try again later.'));
      }),
    );
    return result;
  }
  @Get('/products1')
  async getAllProducts1(@Query() query: any) {
    const result = this.orderClient.send('getProducts1', query).pipe(
      timeout(6000),
      catchError((err) => {
        console.error('Microservice error or timeout:', err.message);
        return throwError(() => new Error(' Please try again later.'));
      }),
    );
    return result;
  }
}
