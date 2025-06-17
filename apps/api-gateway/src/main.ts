import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule); // 👈 HTTP app
  await app.listen(process.env.PORT || 3000);
  console.log(
    `API Gateway running on http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
