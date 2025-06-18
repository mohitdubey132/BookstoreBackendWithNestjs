import {
  IS_EMAIL,
  IsEmail,
  isEmail,
  IsEnum,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  isString,
} from 'class-validator';

export enum UserTypes {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
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
