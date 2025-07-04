import { Module } from '@nestjs/common';
import { OrderAndProductController } from './order_and_product.controller';
import { OrderAndProductService } from './order_and_product.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Register the RabbitMQ microservice client dynamically
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule], // So ConfigService is available
        inject: [ConfigService], // Inject ConfigService into the factory
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://admin:admin@localhost:5672',
            ],
            queue: 'user_queue',
            queueOptions: {
              durable: false,
              messageTtl: 6000,
            },
          },
        }),
      },
    ]),

    PrismaClientModule,
  ],
  controllers: [OrderAndProductController],
  providers: [OrderAndProductService],
})
export class OrderAndProductModule {}
