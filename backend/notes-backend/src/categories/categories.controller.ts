// src/categories/categories.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard('jwt')) // 🔒 Protege este endpoint
  @Get()
  getAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  createCategory(@Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoriesService.create(categoryData);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
