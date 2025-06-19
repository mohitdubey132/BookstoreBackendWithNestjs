import { Injectable } from '@nestjs/common';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { Extensions } from '../generated/prisma/runtime/library';
import { Address_DTO, tokenPayLoad, User } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class UserServiceService {
  constructor(
    private readonly prisma: PrismaClientService,
    private readonly jwt: JwtService,
  ) {}

  async createUser(data: User) {
    const hash = await argon.hash(data.hashPassword);
    console.log('hash----------->', hash);
    const res = await this.prisma.user
      .create({
        data: {
          mobileNo: data.mobile_no,
          name: data.name,
          emailId: data.email,
          hashPassword: hash,
        },
      })
      .catch((err) => {
        console.log(
          '---------------------------------------------------------',
        );
        console.log(err);
        return err;
        console.log('-----------------------------------');
      });
    if (res) {
      const payload = { user: res.id, email: res.email };

      return { USER: res };
    }
  }

  // Add address service
  async createAddress(data: Address_DTO) {
    const res = this.prisma.address
      .create({
        data: {
          city: data.city,
          pinCode: data.pinCode,
          landMark: data.landMark,
          firstName: data.firstName,
          lastName: data.lastName,
          road: data.road,
          userId: data.userId,
          mobileNo: data.mobileNo,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (res) {
      return { USER: res };
    }
  }

  // sign token
  async signtoken(payload: tokenPayLoad) {
    const token = this.jwt.sign(payload, {
      expiresIn: '17m',
      secret: process.env.secreat ?? 'xhbwhj#bjweec',
    });
    console.log(process.env);
    return token;
  }
  // login
  async login(mobileNo: string, plainPassword: string) {
    try {
      // 1. Find user by mobile number
      const user = await this.prisma.user.findUnique({
        where: {
          mobileNo: mobileNo,
        },
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // 2. Verify password
      const isPasswordValid = await argon.verify(
        user.hashPassword,
        plainPassword,
      );

      if (!isPasswordValid) {
        return { success: false, message: 'Invalid password' };
      }

      // 3. Return user info (you can add JWT here if needed)

      return { isValid: isPasswordValid, User: user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // varify token
  async verifyToken(token: string) {
    try {
      const res = this.jwt.verify(token, {
        secret: process.env.secreat ?? 'xhbwhj#bjweec',
      });
      return res; // token is valid, return payload
    } catch (error) {
      // token is invalid or expired
      return {
        isValid: false,
        message: error.message || 'Invalid token',
      };
    }
  }
}
