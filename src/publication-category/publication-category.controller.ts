import { Controller, Post, Query } from '@nestjs/common';
import { PublicationCategoryService } from './publication-category.service';

@Controller('publication')
export class PublicationCategoryController {
  constructor(
    private readonly publicationCategoryService: PublicationCategoryService,
  ) {}

  @Post('populate')
  async populateCategories(
    @Query('skip') skip: number,
    @Query('size') size: number,
  ): Promise<string> {
    try {
      await this.publicationCategoryService.populateDatabaseFromExternalApi(
        skip,
        size,
      );
      return 'Data populated successfully!';
    } catch (error) {
      return `Failed to populate data: ${error}`;
    }
  }
}
