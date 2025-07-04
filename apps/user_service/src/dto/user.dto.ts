import { Prisma } from '../../generated/prisma/client';
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
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// export enum UserTypes {
//   ADMIN = 'admin',
//   CUSTOMER = 'normal',
//   STAFF = 'staff',
// }

export enum UserTypes {
  NORMAL = 'normal',
  ADMIN = 'admin',
  STAFF = 'staff',
}

export class User {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'mobile_no must be a valid 10-digit Indian mobile number',
  })
  mobile_no: string;

  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  hashPassword: string;
  // @IsOptional()
  // @IsEnum(UserTypes)
  // userType: UserTypes;
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
  @IsOptional()
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
