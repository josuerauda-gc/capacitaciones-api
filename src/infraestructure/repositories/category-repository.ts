import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/application-core/domain/entities/category-entity';
import ICategory from 'src/application-core/interfaces/i-category';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository implements ICategory {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  getAllCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      where: { active: true },
    });
  }
}
