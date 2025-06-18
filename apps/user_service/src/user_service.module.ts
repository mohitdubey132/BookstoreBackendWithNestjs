import { Module } from '@nestjs/common';
import { UserServiceController } from './user_service.controller';
import { UserServiceService } from './user_service.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
