import { Global, Module } from '@nestjs/common';
import { OrderAndProductController } from './order_and_product.controller';
import { OrderAndProductService } from './order_and_product.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaClientModule,
  ],
  controllers: [OrderAndProductController],
  providers: [OrderAndProductService],
})
export class OrderAndProductModule {}
