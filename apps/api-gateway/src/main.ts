import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule); // 👈 HTTP app
  app.enableCors({
    origin: 'http://localhost:3001', // ✅ your Next.js frontend
    credentials: true, // ✅ allow cookies if using them
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
