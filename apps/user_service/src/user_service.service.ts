import { Injectable } from '@nestjs/common';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { Extensions } from '../generated/prisma/runtime/library';
import { User } from './dto';

@Injectable()
export class UserServiceService {
  constructor(private readonly prisma: PrismaClientService) {}
  getHello(data): string {
    return 'Hello World!';
  }
 async createUser(data: User) {
    const res = await this.prisma.user.create({
      data: {
        mobileNo: data.mobile_no,
        name: data.name,
        emailId: data.email,
        hashPassword: data.hashPassword,
      },
    }).catch((err)=>{console.log("---------------------------------------------------------")
      console.log(err)
      console.log("-----------------------------------")
    });
   if (res){
    return {USER: res};
   }
  }
}
