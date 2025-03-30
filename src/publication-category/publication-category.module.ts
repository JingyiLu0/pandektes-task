import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationCategory } from './publication-category.entity';
import { PublicationCategoryService } from './publication-category.service';
import { PublicationCategoryController } from './publication-category.controller';
import { CategoryModule } from '../categories/category.module';
import { PublicationModule } from '../publications/publication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicationCategory]),
    CategoryModule,
    PublicationModule,
  ],
  providers: [PublicationCategoryService],
  exports: [PublicationCategoryService],
  controllers: [PublicationCategoryController],
})
export class PublicationCategoryModule {}
