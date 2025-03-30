import { Controller, Post } from '@nestjs/common';
import { PublicationCategoryService } from './publication-category.service';

@Controller('publication-category')
export class PublicationCategoryController {
  constructor(
    private readonly publicationCategoryService: PublicationCategoryService,
  ) {}

  @Post('populate')
  async populateCategories(): Promise<string> {
    try {
      await this.publicationCategoryService.populateDatabaseFromExternalApi();
      return 'Data populated successfully!';
    } catch (error) {
      return `Failed to populate data: ${error}`;
    }
  }
}
