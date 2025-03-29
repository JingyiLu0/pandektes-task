import { Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('populate')
  async populateCategories(): Promise<string> {
    try {
      await this.categoryService.populateCategoriesFromExternalApi();
      return 'Categories populated successfully!';
    } catch (error) {
      return `Failed to populate categories: ${error}`;
    }
  }
}
