import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  isNumber,
  IsNumberString,
  IsOptional,
  isString,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  CANCEL_REQUESTED = 'CANCEL_REQUESTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  COD = 'COD',
}

// Product DTO
export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}

// Order DTO (Basic)
export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsInt()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

// OrderItem DTO
export class CreateOrderItemDTO {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  unitPrice: number;

  @IsUUID()
  productId: string;

  @IsUUID()
  orderId: string;
}

// Shipping Address DTO
export class CreateShippingAddressDTO {
  @IsUUID()
  orderId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  landMark: string;

  @IsString()
  road: string;

  @IsString()
  city: string;

  @IsString()
  pinCode: string;

  @IsString()
  mobileNo: string;
}

// Payment DTO
export class CreatePaymentDTO {
  @IsUUID()
  orderId: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  collectedAt?: Date;
}

// ==============================
// Nested DTOs for Full Order Creation
// ==============================

export class CreateOrderItemWithoutOrderDTO {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  unitPrice: number;

  @IsUUID()
  productId: string;
}

export class CreateShippingAddressWithoutOrderDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  landMark: string;

  @IsString()
  road: string;

  @IsString()
  city: string;

  @IsString()
  pinCode: string;

  @IsString()
  mobileNo: string;
}

export class CreatePaymentWithoutOrderDTO {
  @IsInt()
  @Min(0)
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  collectedAt?: Date;
}

// ✅ Full Order Creation DTO
export class CreateFullOrderDTO {
  @IsString()
  // @IsNotEmpty()
  customerId: string;
  @IsString()
  token: string;
  @IsInt()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsNotEmpty()
  @ValidateNested()
  items: CreateOrderItemWithoutOrderDTO[];

  @IsNotEmpty()
  shippingAddress: CreateShippingAddressWithoutOrderDTO;

  @IsNotEmpty()
  payment: CreatePaymentWithoutOrderDTO;
}

// product-query.dto.ts
export class ProductQueryDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice must be a number' })
  minPrice?: number;
  @IsNumberString()
  @IsOptional()
  maxPrice?: number;
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  @IsInt()
  @IsOptional()
  page?: number;
  @IsInt()
  @IsOptional()
  limit?: number;
}

export class ProductById {
  @IsString()
  @IsNotEmpty()
  productId: string;
}

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
  ABANDONED = 'ABANDONED',
}

export class CreateCartItemDTO {
  @IsString()
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  @IsString()
  cartId: string;
  @IsInt()
  @Min(1)
  quantity: number;
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsInt()
  @Min(0)
  unitPrice: number;
}

export class CreateCartIteFirstmDTO {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  unitPrice: number;
}
export class CreateCartDTO {
  @IsString()
  @IsOptional()
  userId: string;
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsEnum(CartStatus)
  status?: CartStatus = CartStatus.ACTIVE;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCartIteFirstmDTO)
  items?: CreateCartIteFirstmDTO[];
}

export class GetCheckoutDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
  @IsNotEmpty()
  @IsString()
  checkoutId: string;
}

export class ModifyCartItemDTO {
  @IsString()
  @IsNotEmpty()
  cartItemId: string;

  @IsIn(['increase', 'decrease'])
  action: 'increase' | 'decrease';
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class ShippingAddressDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  landMark: string;

  @IsString()
  @IsNotEmpty()
  road: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  pinCode: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'mobile_no must be a valid 10-digit Indian mobile number',
  })
  mobileNo: string;
}

export class PlaceOrderDTO {
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @IsString()
  @IsOptional()
  customerId: string;
  @IsString()
  @IsOptional()
  customerName: string;
  @IsString()
  @IsOptional()
  customerEmail: string;
  @IsString()
  @IsOptional()
  customerPhone: string;

  @IsNotEmpty()
  @IsString()
  token: string;
  @ValidateNested()
  @Type(() => ShippingAddressDTO)
  @IsOptional()
  shippingAddress: ShippingAddressDTO; // ✅ optional
   @IsOptional()
  paymentMethod: 'COD' | 'RAZORPAY';
}

export class GetUserOrderDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please login ' })
  token: String;
  @IsOptional()
  @IsString()
  userId: string;
}

export class GetOrdersDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please login ' })
  token: String;
}
export class GetOrderDetails {
  @IsString()
  @IsNotEmpty({ message: 'Please login ' })
  token: String;
  @IsOptional()
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;
}

export class UpdateOrderStatusDTO extends GetOrderDetails {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  token: string;
  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  token: string;
  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}
export class VerifyPaymentDTO {
   @IsNotEmpty()
  @IsString()
  token: string;
  @IsNotEmpty()
  @IsString()
  razorpay_payment_id: string;

  @IsNotEmpty()
  @IsString()
  razorpay_order_id: string;

  @IsNotEmpty()
  @IsString()
  razorpay_signature: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
