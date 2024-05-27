import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth('access_token')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.productsService.create(createProductDto, userId);
  }

  @ApiBearerAuth('access_token')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@GetCurrentUserId() userId: number) {
    return this.productsService.findAll(userId);
  }

  @ApiBearerAuth('access_token')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.productsService.findOne(userId, id);
  }

  @ApiBearerAuth('access_token')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.productsService.update(userId, updateProductDto, id);
  }

  @ApiBearerAuth('access_token')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.productsService.remove(userId, id);
  }
}
