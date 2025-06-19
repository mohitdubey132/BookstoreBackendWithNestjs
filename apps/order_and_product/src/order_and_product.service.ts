import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { ProductQueryDTO } from './dto';

const prisma = new PrismaClient();
@Injectable()
export class OrderAndProductService {
  constructor(private readonly prisma: PrismaClientService) {}
  // const res = prisma.order.

  getHello(): string {
    return 'Hello World!';
  }
  async fetchProducts() {
    const res = await this.prisma.product.findMany();

    if (res) {
      return {
        products: res,
        success: true,
        message: 'here are all products ',
      };
    } else {
      return { products: [], success: false, message: 'no product found ' };
    }
  }
  async fetchProducts1(query: ProductQueryDTO = {}) {
    const {
      name,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }
    if (inStock) where.stock = { gt: 0 };

    const products = await this.prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.product.count({ where });

    return {
      success: true,
      message: products.length ? 'Here are the products' : 'No products found',
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
