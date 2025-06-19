import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
// ✅ Ensure env is loaded before Prisma runs
dotenv.config();
@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    console.log(config.get('DATABASE_URL'));
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ??
            'postgresql://order_admin:order123@localhost:5433/order_and_product?schema=public',
        }, // please help i am not able to resolve this with env
      },
    });
    console.log(config.get('DATABASE_URL'));
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
