import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const product = await this.prismaService.product.create({
      data: {
        ...createProductDto,
        price: Number(createProductDto.price),
        user_id: userId,
      },
    });

    return product;
  }

  async findAll(userId: number) {
    const product = await this.prismaService.product.findMany({
      where: { user_id: userId },
    });

    if (!product) {
      throw new HttpException('Products are not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async findOne(userId: number, id: number) {
    const product = await this.prismaService.product.findFirst({
      where: { user_id: userId, id: id },
    });

    if (!product) {
      throw new HttpException('Product is not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async update(userId: number, updateProductDto: UpdateProductDto, id: number) {
    const product = await this.findOne(userId, id);

    if (!product) {
      throw new HttpException('Product is not found', HttpStatus.NOT_FOUND);
    }

    return await this.prismaService.product.update({
      where: {
        user_id: userId,
        id: id,
      },
      data: updateProductDto,
    });
  }

  async remove(userId: number, id: number) {
    const product = await this.findOne(userId, id);

    if (!product) {
      throw new HttpException('Product is not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.product.delete({
      where: {
        user_id: userId,
        id: id,
      },
    });

    return true;
  }
}
