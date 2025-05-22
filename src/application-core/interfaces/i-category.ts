import { CategoryEntity } from '../domain/entities/category-entity';

export default interface ICategory {
  getAllCategories(): Promise<CategoryEntity[]>;
}
