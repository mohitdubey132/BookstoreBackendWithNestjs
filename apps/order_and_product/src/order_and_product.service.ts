import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderAndProductService {
  getHello(): string {
    return 'Hello World!';
  }
}
