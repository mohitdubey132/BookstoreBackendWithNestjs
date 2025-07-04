import { NestFactory } from '@nestjs/core';
import { OrderAndProductModule } from './order_and_product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderAndProductModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: 'orders_queue',
        queueOptions: {
          durable: true,
          messageTtl: 6000,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
