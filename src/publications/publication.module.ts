import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationService } from './publication.service';
import { Publication } from './publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication])],
  providers: [PublicationService],
  exports: [PublicationService],
})
export class PublicationModule {}
