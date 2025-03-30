import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicationCategory } from './publication-category.entity';
import { ExternalPublication } from '../publications/publication.service';
import { CategoryService } from '../categories/category.service';
import { PublicationService } from '../publications/publication.service';

interface ExternalCategory {
  category: string;
  count: number;
}

interface ResponseSchema {
  categoryCounts: ExternalCategory[];
  publications: ExternalPublication[];
  [key: string]: unknown;
}

const options = {
  method: 'POST',
  url: 'https://mfkn.naevneneshus.dk/api/search',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-GB,en;q=0.6',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'application/json',
    Origin: 'https://mfkn.naevneneshus.dk',
    Pragma: 'no-cache',
    Referer:
      'https://mfkn.naevneneshus.dk/soeg?sort=desc&s=&categories=&types=ruling',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-GPC': '1',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
  },
  data: {
    categories: [],
    query: '',
    sort: 'Descending',
    types: ['ruling'],
    skip: 0,
    size: 100,
  },
};

@Injectable()
export class PublicationCategoryService {
  constructor(
    @InjectRepository(PublicationCategory)
    private publicationCategoryRepository: Repository<PublicationCategory>,
    private categoryService: CategoryService,
    private publicationService: PublicationService,
  ) {}

  async bulkCreateOrUpdate(
    externalPublications: ExternalPublication[],
  ): Promise<void> {
    for (const externalPub of externalPublications) {
      const publication = await this.publicationService.getById(externalPub.id);
      if (!publication) {
        console.error(`Publication with id ${externalPub.id} not found!`);
        continue;
      }
      const categories = await this.categoryService.getByNames(
        externalPub.categories,
      );

      if (!categories?.length) {
        console.error(
          `Category ${externalPub.categories.toString()}not found!`,
        );
        continue;
      }

      const mappingEntries: PublicationCategory[] = [];

      await Promise.all(
        categories.map(async (category) => {
          const existingMapping =
            await this.publicationCategoryRepository.findOne({
              where: {
                publication: publication,
                category: category,
              },
            });
          if (!existingMapping) {
            const mapping = new PublicationCategory();
            mapping.publication = publication;
            mapping.category = category;
            mappingEntries.push(mapping);
          }
        }),
      );

      if (mappingEntries.length) {
        await this.publicationCategoryRepository.save(mappingEntries);
      }
    }
  }

  async populateDatabaseFromExternalApi(): Promise<void> {
    await axios
      .request<ResponseSchema>(options)
      .then(async (response) => {
        const categories: ExternalCategory[] = response.data.categoryCounts;
        await this.categoryService.bulkCreateOrUpdate(categories);
        await this.publicationService.bulkSavePublications(
          response.data.publications,
        );
        await this.bulkCreateOrUpdate(response.data.publications);
      })
      .catch((err) => {
        console.error('Error fetching categories from external API:', err);
        throw new Error('Failed to populate categories');
      });
  }
}
