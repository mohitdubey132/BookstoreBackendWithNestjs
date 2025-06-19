import { Global, Module } from '@nestjs/common';
import { OrderAndProductController } from './order_and_product.controller';
import { OrderAndProductService } from './order_and_product.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'user_queue',
          queueOptions: { durable: false, messageTtl: 6000 },
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaClientModule,
  ],
  controllers: [OrderAndProductController],
  providers: [OrderAndProductService],
})
export class OrderAndProductModule {}
