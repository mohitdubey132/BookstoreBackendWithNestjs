import { Module } from '@nestjs/common';
import { UserServiceController } from './user_service.controller';
import { UserServiceService } from './user_service.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaClientModule,
    JwtModule.register({}),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
