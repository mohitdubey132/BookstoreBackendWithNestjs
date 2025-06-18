import { Body, Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserServiceService } from './user_service.service';

import { User } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validatePayload } from './utils/validate';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}



    @MessagePattern('create_user')
  
     async handleOrder(data:User) {
      let reserror ;
      const validData = await validatePayload(User, data).then().catch((err)=>{console.log("gggggg",err.response),
        reserror = err.response ;
      })
      let output ;
      if(validData){
         output =await this.userServiceService.createUser(data)
      }
    //  const output = await this.userServiceService.createUser(data)
    console.log(data ,"--------------",validData);
    return reserror?? { success: true, message: 'Order Created',output };
  }
}
