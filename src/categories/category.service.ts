import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './category.entity';
import axios from 'axios';
interface ExternalCategory {
  category: string;
  count: number;
}
interface ResponseSchema {
  categoryCounts: ExternalCategory[];
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
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(name: string): Promise<Category> {
    const category = new Category();
    category.name = name;
    return this.categoryRepository.save(category);
  }

  async bulkCreateOrUpdate(
    externalCategories: ExternalCategory[],
  ): Promise<Category[]> {
    const categoriesToSave: Category[] = [];

    for (const extCat of externalCategories) {
      let category = await this.categoryRepository.findOne({
        where: { name: extCat.category },
      });

      if (category) {
        category.name = extCat.category;
      } else {
        category = new Category();
        category.name = extCat.category;
      }

      categoriesToSave.push(category);
    }
    return this.categoryRepository.save(categoriesToSave);
  }

  async getByNames(names: string[]): Promise<Category[] | null> {
    return this.categoryRepository.find({
      where: { name: In(names) },
    });
  }

  async populateCategoriesFromExternalApi(): Promise<void> {
    await axios
      .request<ResponseSchema>(options)
      .then(async (response) => {
        const categories: ExternalCategory[] = response.data.categoryCounts;
        const categoryEntities: Category[] = categories.map(
          (category: ExternalCategory) => {
            const categoryEntity = new Category();
            categoryEntity.name = category.category;
            return categoryEntity;
          },
        );
        // Save the categories in bulk
        await this.categoryRepository.save(categoryEntities);
        console.log('Categories populated successfully!');
      })
      .catch((err) => {
        console.error('Error fetching categories from external API:', err);
        throw new Error('Failed to populate categories');
      });
  }
}
