import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user_service.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'user_queue',
        queueOptions: {
          durable: false,
          messageTtl: 6000,
        },
      },
    },
  );
  // 💡 Start listening and log status
  await app.listen();
  console.log('✅ UserService connected to RabbitMQ and is listening...');
}
bootstrap();
