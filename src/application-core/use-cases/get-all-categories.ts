import { Inject } from '@nestjs/common';
import { CategoryDto } from '../dto/general/category-dto';
import { CATEGORY_SERVICE } from 'src/infraestructure/interface-provider';
import { CategoryRepository } from 'src/infraestructure/repositories/category-repository';
import { plainToInstance } from 'class-transformer';

export class GetAllCategories {
  constructor(
    @Inject(CATEGORY_SERVICE)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.getAllCategories();
    return plainToInstance(CategoryDto, categories, {
      excludeExtraneousValues: true,
    });
  }
}
