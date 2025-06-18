import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
  
{
  constructor() {
    super({
      log: ['query'], 
      datasources:{
        db:{
          url:"postgresql://user_admin:secret123@localhost:5435/user_db?schema=public"
        }
      }
        // optional logging
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
