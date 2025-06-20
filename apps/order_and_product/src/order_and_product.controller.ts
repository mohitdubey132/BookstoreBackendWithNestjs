import { Controller, Inject } from '@nestjs/common';
import { OrderAndProductService } from './order_and_product.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateCartDTO,
  CreateCartItemDTO,
  CreateFullOrderDTO,
  GetCheckoutDTO,
  ModifyCartItemDTO,
  PlaceOrderDTO,
  ProductQueryDTO,
} from './dto';
import { validatePayload } from './utils/validate';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Controller()
export class OrderAndProductController {
  constructor(
    private readonly orderAndProductService: OrderAndProductService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}
  @MessagePattern('create_order')
  async handleOrder(data: CreateCartDTO) {
    let reserror: any;
    const validData = await validatePayload(CreateCartDTO, data)
      .then()
      .catch((err) => {
        console.log('ggggggggggggggggggggggggggggggg,', err.response);
        reserror = err.response;
      });
    console.log('ggggggggggggggggggg', data);
    if (validData) {
      if (data.token) {
        const result: any = await firstValueFrom(
          this.userClient.send('verifyToken', data.token).pipe(
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
          ),
        );

        console.log('---------------------------------->', result);
        // return result;
        let newCartData: CreateCartDTO = { ...data };
        if (result?.status === true) {
          newCartData = { ...newCartData, userId: result.user.id };
          const finalResult =
            await this.orderAndProductService.createCart(newCartData);
          return finalResult;
        } else {
          return {
            success: false,
            message:
              'user not found please login and try agin' +
              JSON.stringify(result),
          };
        }
      }
    }
    return reserror ?? { success: true, message: 'Address Added' };
  }
  //  item add in cart
  @MessagePattern('add_item')
  async addItems(data: CreateCartItemDTO) {
    let reserror: any;
    const validData = await validatePayload(CreateCartItemDTO, data)
      .then()
      .catch((err) => {
        reserror = err.response;
      });
    console.log('ggggggggggggggggggg', data);
    if (validData) {
      if (data.cartId) {
        const result: any = await firstValueFrom(
          this.userClient.send('verifyToken', data.token).pipe(
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
          ),
        );

        console.log('---------------------------------->', result);
        // return result;
        let newCartData: CreateCartItemDTO = { ...data };
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.addItemInCart(newCartData);
          return finalResult;
        } else {
          return {
            success: false,
            message:
              'user not found please login and try agin' +
              JSON.stringify(result),
          };
        }
      }
    }
    return reserror;
  }

  //  get chechout data
  @MessagePattern('getCheckout')
  async getCheckout(data: GetCheckoutDTO) {
    let reserror: any;
    const validData = await validatePayload(GetCheckoutDTO, data)
      .then()
      .catch((err) => {
        reserror = err.response;
      });
    console.log('ggggggggggggggggggg', data);
    if (validData) {
      if (data.checkoutId) {
        const result: any = await firstValueFrom(
          this.userClient.send('verifyToken', data.token).pipe(
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
          ),
        );

        console.log('---------------------------------->', result);
        // return result;
        let newCartData: GetCheckoutDTO = { ...data };
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.getCheckout(newCartData);
          return finalResult;
        } else {
          return {
            success: false,
            message:
              'user not found please login and try agin' +
              JSON.stringify(result),
          };
        }
      }
    }
    return reserror;
  }

  @MessagePattern('updateCartItem')
  async updateCartItem(data: ModifyCartItemDTO) {
    let reserror: any;
    const validData = await validatePayload(ModifyCartItemDTO, data)
      .then()
      .catch((err) => {
        reserror = err.response;
      });
    if (validData) {
      if (data.cartItemId) {
        const result: any = await firstValueFrom(
          this.userClient.send('verifyToken', data.token).pipe(
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
          ),
        );

        console.log('---------------------------------->', result);
        // return result;
        let newCartData: ModifyCartItemDTO = { ...data };
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.modifyCartItemQuantity(
              newCartData,
            );
          return finalResult;
        } else {
          return {
            success: false,
            message: 'user not found please login and try agin',
          };
        }
      }
    }
    return reserror;
  }

   @MessagePattern('confirmOrder')
  async confirmOrder(data: PlaceOrderDTO) {
    let reserror: any;
    const validData = await validatePayload(PlaceOrderDTO, data)
      .then()
      .catch((err) => {
        reserror = err.response;
      });
    if (validData) {
      if (data.cartId) {
        const result: any = await firstValueFrom(
          this.userClient.send('verifyToken', data.token).pipe(
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
          ),
        );

        console.log('---------------------------------->', result);
        // return result;
      // id
      //    name: user.name,
      // email: user?.emailId,
      // userType: user.userType,
      // mobile_no: user.mobileNo,
        let newCartData: PlaceOrderDTO = { ...data,customerEmail:result.user.email,
          customerName:result.user.name,customerPhone:result.user.mobile_no,
        customerId:result.user.id };
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.placeOrderFromCart(
              newCartData,
            );
          return finalResult;
        } else {
          return {
            success: false,
            message: 'user not found please login and try agin',
          };
        }
      }
    }
    return reserror;
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
