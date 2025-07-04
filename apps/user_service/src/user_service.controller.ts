import { Controller } from '@nestjs/common';
import { UserServiceService } from './user_service.service';

import { Address_DTO, GetUserResponse, tokenPayLoad, User } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validatePayload } from './utils/validate';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @MessagePattern('create_user')
  async handleOrder(data: User) {
    let reserror: any;
    const validData = await validatePayload(User, data)
      .then()
      .catch((err) => {
        console.log('gggggg', err.response), (reserror = err.response);
      });
    let output: any;
    let token: any;
    if (validData) {
      output = await this.userServiceService.createUser(data);
      if (output.USER?.id) {
        token = await this.userServiceService.signtoken({
          id: output.USER?.id,
          userType: output.USER?.userType,
        });
        return {
          success: true,
          user: output,
          message: ' User has been created ',
          token: token,
        };
      } else {
        return {
          success: false,
          message: 'User no create This mobile number is already registered ',
        };
      }
    }
    //  const output = await this.userServiceService.createUser(data)
    console.log(data, '--------------', validData);
    return reserror;
  }
  // create address controller
  @MessagePattern('create_address')
  async createaddress(data: Address_DTO) {
    let reserror: any;
    const validData = await validatePayload(Address_DTO, data)
      .then()
      .catch((err) => {
        reserror = err.response;
      });
    let output: any;
    if (validData) {
      output = await this.userServiceService.createAddress(data);
    }
    //  const output = await this.userServiceService.createUser(data)

    return reserror ?? { success: true, message: 'Address Added', output };
  }
  // login
  @MessagePattern('login')
  async login(data: any) {
    let reserror: any;

    const output = await this.userServiceService.login(
      data.mobileNo,
      data.password,
    );

    if (!output?.User?.id) {
      return {
        success: false,
        message: 'Wrong user credentials',
      };
    }
    const token = await this.userServiceService.signtoken({
      id: output?.User?.id,
      userType: output.User?.userType, // default fallback
    });
    //  const output = await this.userServiceService.createUser(data)
    const user = {
      id: output.User?.id,
      name: output.User?.name,
      emailId: output.User?.emailId,

      mobileNo: output.User?.mobileNo,
      userType: output.User?.userType,
    };
    return (
      reserror ?? { success: true, message: 'Address Added', user: user, token }
    );
  }
  @MessagePattern('verifyToken')
  async verifyToken(token: string) {
    // console.log(token,typeof(token.token))
    const isValid = await this.userServiceService.verifyToken(token);
    let user: GetUserResponse;
    if (isValid.isValid) {
      user = await this.userServiceService.GetUser(isValid?.res?.id);
      return { status: isValid.isValid, tokenIsValid: isValid, user: user };
    }
    return { status: isValid.isValid, tokenIsValid: isValid };
  }

  @MessagePattern('getuserInfo')
  async getUserData(data: any) {
    // console.log(token,typeof(token.token))
    const isValid = await this.userServiceService.verifyToken(data?.token);
    let user: GetUserResponse;
    if (isValid.isValid) {
      user = await this.userServiceService.GetUser(isValid?.res?.id);
      return { success: true, user: user, message: 'user details' };
    }
    return {
      success: false,
      message: 'User details not found please login again ',
    };
  }
}
