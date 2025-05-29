import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CategoryDto } from 'src/application-core/dto/general/category-dto';
import { GetAllCategories } from 'src/application-core/use-cases/get-all-categories';

@Controller('categories')
export class CategoryController {
  constructor(private readonly getAllCategories: GetAllCategories) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listado de categorías de evaluación',
    type: CategoryDto,
  })
  async getAllCategoriesHandler(): Promise<CategoryDto[]> {
    return await this.getAllCategories.execute();
  }
}
