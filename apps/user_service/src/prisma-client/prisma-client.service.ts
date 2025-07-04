import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      log: ['query'],
      datasources: {
        db: {
          url:
            config.get('DATABASE_URL1') ??
            'postgresql://user_admin:secret123@localhost:5435/user_db?schema=public',
        },
      },
      // optional logging
    });
    console.log(config.get('DATABASE_URL1'));
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
