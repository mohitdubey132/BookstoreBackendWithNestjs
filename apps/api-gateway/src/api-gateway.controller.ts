import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { sendWithTimeout } from './helper/sendWithTimeOut';

@Controller('/api')
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('/checkout')
  async creatCheckout(@Body() data: any) {
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

  // getUser orders  getUserOrders
  @Post('/userOrders')
  async getuserOrders(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'getUserOrders', data),
    );
    return result;
  }

  // getUser orders  getOrderDetails
  @Post('/OrderDetails')
  async getOrderDetail(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'getOrderDetails', data),
    );
    return result;
  }

  // verifyPayment
    @Post('/verify-payment')
  async verifyPaymentForOrder(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'verifyPayment', data),
    );
    return result;
  }
  @Post('/updateOrderStatus')
  async updateOrderStatus(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'updateOrderStatus', data),
    );
    return result;
  }

  @Post('/createProduct')
  async createProduct(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'createProduct', data),
    );
    return result;
  }
  @Put('/Product')
  async UpdateProduct(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'updateProduct', data),
    );
    return result;
  }

  @Get('/Product')
  async GetProduct(@Query() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'Product', data),
    );
    return result;
  }
  @Post('/getOrderList')
  async getOrders(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'getOrders', data),
    );
    return result;
  }
  @Post('/userinfo')
  async getuserinfo(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.userClient, 'getuserInfo', data),
    );

    return result;
  }
  @Post('/getCheckout')
  async getCheckout(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'getCheckout', data),
    );

    return result;
  }
  @Post('/placeOrder')
  async createOrder(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'confirmOrder', data),
    );
    return result;
  }
  @Post('/updateCartItem')
  async updateCartItem(@Body() data: any) {
    const result = await firstValueFrom(
      sendWithTimeout(this.orderClient, 'updateCartItem', data),
    );
    return result;
  }
  // add_item'
  @Post('/addItem')
  async addTemInCart(@Body() data: any) {
    const result = this.orderClient.send('add_item', data).pipe(
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
