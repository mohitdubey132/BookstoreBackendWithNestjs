import { NestFactory } from '@nestjs/core';
import { OrderAndProductModule } from './order_and_product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderAndProductModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
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
