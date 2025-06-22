import { Controller, Inject } from '@nestjs/common';
import { OrderAndProductService } from './order_and_product.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateCartDTO,
  CreateCartItemDTO,
  CreateFullOrderDTO,
  CreateProductDto,
  CreateProductDTO,
  GetCheckoutDTO,
  GetOrderDetails,
  GetOrdersDTO,
  GetUserOrderDTO,
  ModifyCartItemDTO,
  PlaceOrderDTO,
  ProductById,
  ProductQueryDTO,
  UpdateOrderStatusDTO,
  UpdateProductDto,
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
            message: 'user not found please login and try agin',
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
            message: 'user not found please login and try agin',
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
            message: 'user not found please login and try agin',
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
        let newCartData: PlaceOrderDTO = {
          ...data,
          customerEmail: result.user.email,
          customerName: result.user.name,
          customerPhone: result.user.mobile_no,
          customerId: result.user.id,
        };
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.placeOrderFromCart(newCartData);
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

  @MessagePattern("getUserOrders")
  async getUserOrder(data:GetUserOrderDTO){
        let reserror: any;
    const validData = await validatePayload(GetUserOrderDTO, data)
      .then()
      .catch((err) => {
        console.log('ggggggggggggggggggggggggggggggg,', err.response);
        reserror = err.response;
      });
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
        let newCartData: GetUserOrderDTO = { ...data ,userId:result.user.id };
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.getOrdersForUser(newCartData);
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


  @MessagePattern("getOrderDetails")
  async getOrderDetails(data:GetOrderDetails){
        let reserror: any;
    const validData = await validatePayload(GetOrderDetails, data)
      .then()
      .catch((err) => {
        console.log('ggggggggggggggggggggggggggggggg,', err.response);
        reserror = err.response;
      });
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
        let newCartData: GetOrderDetails = { ...data };
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.getOrderDetails(newCartData);
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
    @MessagePattern("updateOrderStatus")
  async updateOrderstatus(data:UpdateOrderStatusDTO){
        let reserror: any;
    const validData = await validatePayload(UpdateOrderStatusDTO, data)
      .then()
      .catch((err) => {
        reserror = err.response;
      });
        if (validData)  {
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
        let newCartData: UpdateOrderStatusDTO = { ...data ,userId: result.user.id  };
        if(data.status !== "CANCEL_REQUESTED" && result.user.userType==="normal")
        {
          return {
            success:false,
            message :"normal user not allowes to do this action "
          }
        }
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.updateOrderStatus(newCartData);
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


   @MessagePattern("getOrders")
  async getOrder(data:GetOrdersDTO){
        let reserror: any;
    const validData = await validatePayload(GetOrdersDTO, data)
      .then()
      .catch((err) => {
        console.log('ggggggggggggggggggggggggggggggg,', err.response);
        reserror = err.response;
      });
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
        let newCartData: GetOrdersDTO = { ...data };

           if( result.user.userType==="normal")
        {
          return {
            success:false,
            message :"normal user not allowes to access this route "
          }
        }
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.getOrders(newCartData);
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
   

     @MessagePattern("createProduct")
  async createProduct(data:CreateProductDto){
        let reserror: any;
    const validData = await validatePayload(CreateProductDto, data)
      .then()
      .catch((err) => {
        console.log('ggggggggggggggggggggggggggggggg,', err.response);
        reserror = err.response;
      });
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
        let newCartData: CreateProductDto = { ...data };

           if( result.user.userType==="normal")
        {
          return {
            success:false,
            message :"normal user not allowes to access this route "
          }
        }
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.createProduct(newCartData);
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
    @MessagePattern("Product")
    async getProduct(data:ProductById){
            let reserror: any;
    const validData = await validatePayload(ProductById, data)
      .then()
      .catch((err) => {
        console.log('ggggggggggggggggggggggggggggggg,', err.response);
        reserror = err.response;
      });
        if (validData) {
      if (data.productId) {
     
            const finalResult =
            await this.orderAndProductService.fetchProduct(data);
          return finalResult;
      
      }
    }
    return reserror;
    } 

    @MessagePattern("updateProduct")
  async updateProduct(data:UpdateProductDto){
        let reserror: any;
    const validData = await validatePayload(UpdateProductDto, data)
      .then()
      .catch((err) => {

        reserror = err.response;
      });
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
        let newCartData: UpdateProductDto = { ...data };

           if( result.user.userType==="normal")
        {
          return {
            success:false,
            message :"normal user not allowes to access  "
          }
        }
        if (result?.status === true) {
          const finalResult =
            await this.orderAndProductService.updateProduct(newCartData);
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
}
