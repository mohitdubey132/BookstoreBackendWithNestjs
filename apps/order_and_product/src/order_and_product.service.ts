import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import {
  CreateCartDTO,
  CreateCartItemDTO,
  CreateProductDto,
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
  VerifyPaymentDTO,
} from './dto';
// import Razorpay from 'razorpay';

const Razorpay = require('razorpay');

import * as crypto from 'crypto'; 

import * as process from 'process';
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

const prisma = new PrismaClient();
@Injectable()
export class OrderAndProductService {
  constructor(private readonly prisma: PrismaClientService) {}
  // const res = prisma.order.
   razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  getHello(): string {
    return 'Hello World!';
  }
  async fetchProducts() {
    const res = await this.prisma.product.findMany();

    if (res) {
      return {
        products: res,
        success: true,
        message: 'here are all products ',
      };
    } else {
      return { products: [], success: false, message: 'no product found ' };
    }
  }
  async fetchProduct(data: ProductById) {
    const res = await this.prisma.product.findUnique({
      where: { id: data?.productId },
    });

    if (res?.id) {
      return {
        product: res,
        success: true,
        message: 'here are all products ',
      };
    } else {
      return { success: false, message: 'no product found ' };
    }
  }
  async fetchProducts1(query: ProductQueryDTO = {}) {
    const {
      name,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }
    if (inStock) where.stock = { gt: 0 };

    const products = await this.prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.product.count({ where });

    return {
      success: true,
      message: products.length ? 'Here are the products' : 'No products found',
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async createCart(cartData: CreateCartDTO) {
    const result = await this.prisma.cart.create({
      data: {
        userId: cartData?.userId,
        ...(cartData.items?.length
          ? {
              items: {
                createMany: {
                  data: cartData.items,
                },
              },
            }
          : {}),
      },
      include: {
        items: true,
      },
    });

    if (result.id) {
      return {
        success: true,
        checkout: result,
        message: 'checkout created ',
      };
    } else {
      return {
        success: false,
        message: 'checkout not created',
      };
    }
  }
  async addItemInCart(cartItem: CreateCartItemDTO) {
    let errorNew: any;
    const result = await this.prisma.cartItem
      .create({
        data: {
          cartId: cartItem.cartId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          unitPrice: cartItem.unitPrice,
        },
      })
      .catch((err) => {
        console.log('err------------------------->', err.meta, err);
        errorNew = {
          success: false,
          message: ' item not  add in cart err ' + err,
        };
      });

    if (result?.id) {
      return {
        success: true,
        data: result,
        message: 'item added in cart',
      };
    } else {
      return errorNew;
    }
  }
  async getCheckout(data: GetCheckoutDTO) {
    let errorNew: any;
    const result = await this.prisma.cart
      .findUnique({
        where: { id: data.checkoutId },
        include: {
          items: {  

            orderBy:{
              createdAt:'desc'
            },
            include: {
              product: true,
            },
          },
        },
      })
      .catch((err) => {
        errorNew = {
          success: false,
          message: ' Checkout not found  ',
        };
      });

    if (result?.id) {
      return {
        success: true,
        data: result,
        message: ' Your checkout till now',
      };
    } else {
      return errorNew;
    }
  }

  async modifyCartItemQuantity(data: ModifyCartItemDTO) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: data.cartItemId },
      include: {
        product: true, //  include the related product to get stock
      },
    });

    if (!cartItem) {
      return {
        success: false,
        message: 'Cart item not found.',
      };
    }

    const currentQty = cartItem.quantity;
    const stockAvailable = cartItem.product.stock;
    const newQty = data.action === 'increase' ? currentQty + 1 : currentQty - 1;

    //  Check stock limit before increasing
    if (data.action === 'increase' && newQty > stockAvailable) {
      return {
        success: false,
        message: `Only ${stockAvailable} items available in stock.`,
      };
    }

    //  Auto-delete logic if quantity drops to 0 or less
    if (newQty <= 0) {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
      return {
        success: true,
        message: 'Cart item removed (quantity reached zero).',
      };
    }

    //  Proceed to update quantity
    const updatedItem = await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: newQty },
    });

    return {
      success: true,
      data: updatedItem,
      message: `Cart item quantity ${data.action}d.`,
    };
  }

  async placeOrderFromCart(data: PlaceOrderDTO) {
    return await this.prisma
      .$transaction(async (tx) => {
        // 1. Fetch cart and items with product
        const cart = await tx.cart.findUnique({
          where: { id: data.cartId },
          include: {
            items: { include: { product: true } },
          },
        });

        if (!cart || cart.items.length === 0) {
          return {
            success: false,
            message: 'Cart not found or is empty.',
          };
        }

        if (cart.status !== 'ACTIVE') {
          return {
            success: false,
            message: 'Order has already been placed for this cart.',
          };
        }
        // 2. Check stock
        for (const item of cart.items) {
          if (item.quantity > item.product.stock) {
            return {
              success: false,
              message: `Insufficient stock for product ${item.product.name}.`,
            };
          }
        }

        // 3. Decrement stock
        for (const item of cart.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // 4. Calculate total
        const totalAmount = cart.items.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0,
        );

        // 5. Create order
        const order = await tx.order.create({
          data: {
            customerId: data.customerId,
            totalAmount,
            status: 'CONFIRMED',
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          },
          include: { items: true },
        });

        // 6. Update cart
        await tx.cart.update({
          where: { id: cart.id },
          data: { status: 'CHECKED_OUT' },
        });

        if (data.shippingAddress) {
          await tx.shippingAddress.create({
            data: {
              orderId: order.id,
              firstName: data.shippingAddress.firstName,
              lastName: data.shippingAddress.lastName,
              landMark: data.shippingAddress.landMark,
              road: data.shippingAddress.road,
              city: data.shippingAddress.city,
              pinCode: data.shippingAddress.pinCode,
              mobileNo: data.shippingAddress.mobileNo,
            },
          });
        }

        // 7. Return success
        return {
          success: true,
          message: 'Order placed successfully.',
          order,
        };
      })
      .catch((err) => {
        // Optional: catch and return microservice-friendly error
        return {
          success: false,
          message: 'Something went wrong during checkout.',
          error: err.message,
        };
      });
  }

  async placeOrderFromCart1(data: PlaceOrderDTO & { paymentMethod: 'COD' | 'RAZORPAY' }) {
  return await this.prisma
    .$transaction(async (tx) => {
      // 1. Fetch cart and items with product
      const cart = await tx.cart.findUnique({
        where: { id: data.cartId },
        include: {
          items: { include: { product: true } },
        },
      });

      if (!cart || cart.items.length === 0) {
        return {
          success: false,
          message: 'Cart not found or is empty.',
        };
      }

      if (cart.status !== 'ACTIVE') {
        return {
          success: false,
          message: 'Order has already been placed for this cart.',
        };
      }

      // 2. Check stock
      for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
          return {
            success: false,
            message: `Insufficient stock for product ${item.product.name}.`,
          };
        }
      }

      // 3. Decrement stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 4. Calculate total
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      // 5. Create Order
      const order = await tx.order.create({
        data: {
          customerId: data.customerId,
          totalAmount,
          status: data.paymentMethod === 'RAZORPAY' ? 'PENDING' : 'CONFIRMED',
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });

      // 6. Update cart
      await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'CHECKED_OUT' },
      });

      // 7. Create shipping address if exists
      if (data.shippingAddress) {
        await tx.shippingAddress.create({
          data: {
            orderId: order.id,
            firstName: data.shippingAddress.firstName,
            lastName: data.shippingAddress.lastName,
            landMark: data.shippingAddress.landMark,
            road: data.shippingAddress.road,
            city: data.shippingAddress.city,
            pinCode: data.shippingAddress.pinCode,
            mobileNo: data.shippingAddress.mobileNo,
          },
        });
      }

      // 8. Payment creation
      if (data.paymentMethod === 'RAZORPAY') {
        const razorpayOrder = await this.razorpay.orders.create({
          amount: totalAmount * 100, // in paise
          currency: 'INR',
          receipt: order.id,
        });

        await tx.payment.create({
          data: {
            orderId: order.id,
            amount: totalAmount,
            method: 'RAZORPAY',
            status: 'PENDING',
            razorpayOrderId: razorpayOrder.id,
          },
        });

        return {
          success: true,
          message: 'Razorpay order created.',
          orderId: order.id,
          razorpayOrderId: razorpayOrder.id,
          amount: totalAmount,
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID,
        };
      } else {
        // COD flow
        await tx.payment.create({
          data: {
            orderId: order.id,
            amount: totalAmount,
            method: 'COD',
            status: 'PENDING',
          },
        });

        return {
          success: true,
          message: 'Order placed successfully (COD)',
          order,
        };
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: 'Something went wrong during checkout.',
        error: err.message,
      };
    });
}
async verifyPayment(data: VerifyPaymentDTO ) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = data;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return {
      success: false,
      message: 'Invalid payment signature',
    };
  }

  // Update payment and order status
  await this.prisma.payment.update({
    where: { orderId },
    data: {
      status: 'SUCCESS',
      razorpayPaymentId: razorpay_payment_id,
      collectedAt: new Date(),
    },
  });

  await this.prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CONFIRMED',
    },
  });

  return {
    success: true,
    message: 'Payment verified and order confirmed.',
  };
}

  async getOrdersForUser(data: GetUserOrderDTO) {
    // const orders = await this.prisma.order.findMany({where:{customerId:data?.userId}
    // ,include:{
    //   items:{}
    // }})
    const orders = await this.prisma.order.findMany({
      where: { customerId: data?.userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (orders.length > 0) {
      return {
        orders: orders,
        success: true,
        message: 'List of all orders ',
      };
    } else {
      return {
        orders: {},
        success: false,
        message: 'no ordr found ',
      };
    }
  }
  async getOrders(data: GetOrdersDTO) {
    // const orders = await this.prisma.order.findMany({where:{customerId:data?.userId}
    // ,include:{
    //   items:{}
    // }})
    const orders = await this.prisma.order.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (orders.length > 0) {
      return {
        orders: orders,
        success: true,
        message: 'List of all orders ',
      };
    } else {
      return {
        orders: {},
        success: false,
        message: 'no ordr found ',
      };
    }
  }
  async getOrderDetails(data: GetOrderDetails) {
    // const orders = await this.prisma.order.findMany({where:{customerId:data?.userId}
    // ,include:{
    //   items:{}
    // }})
    const orders = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        shippingAddress: true,
        items: {
          include: { product: true },
        },
        payment:true,
        _count: {
          select: { items: true },
        },
      },
    });

    if (orders?.id) {
      return {
        order: orders,
        success: true,
        message: 'order details  ',
      };
    } else {
      return {
        order: {},
        success: false,
        message: 'no order found ',
      };
    }
  }
  async updateOrderStatus(data: UpdateOrderStatusDTO) {
    const orders = await this.prisma.order.update({
      data: { status: data.status },
      where: { id: data.orderId },
      include: {
        shippingAddress: true,
        items: { include: { product: true } },
      },
    });

    if (orders?.id) {
      return {
        order: orders,
        success: true,
        message: 'order status updated   ',
      };
    } else {
      return {
        order: {},
        success: false,
        message: 'no order found ',
      };
    }
  }

  async createProduct(data: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        thumbnail: data.thumbnail,
      },
    });
    if (product?.id) {
      return {
        success: true,
        product: product,
        message: 'product created ',
      };
    } else {
      return {
        success: false,
        message: 'product not created ',
      };
    }
  }

  async updateProduct(data: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          thumbnail: data.thumbnail,
        },
      });

      return {
        success: true,
        product: updatedProduct,
        message: 'Product updated successfully',
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        message: 'Product update failed',
      };
    }
  }
}
