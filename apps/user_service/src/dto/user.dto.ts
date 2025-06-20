import {
  IS_EMAIL,
  IsEmail,
  isEmail,
  IsEnum,
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
  isNumberString,
  IsOptional,
  IsString,
  isString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum UserTypes {
  ADMIN = 'admin',
  CUSTOMER = 'normal',
  STAFF = 'staff',
}
export class User {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsString()
  mobile_no: string;

  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  hashPassword: string;
  @IsEnum(UserTypes)
  userType: UserTypes;
}

export class Address_DTO {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  landMark: string;
  @IsString()
  road: string;
  @IsString()
  city: string;
  @IsString()
  pinCode: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  mobileNo: string;
}

export class tokenPayLoad {
  @IsString()

  id: string;
  @IsString()

  userType: UserTypes;
}
export interface UserResponseDTO {
  id: string;
  name: string;
  email: string | null;
  userType: string; // Or use an enum if available
  mobile_no: string;
}

export interface UserNotFoundDTO {
  message: string;
}

export type GetUserResponse = UserResponseDTO | UserNotFoundDTO;