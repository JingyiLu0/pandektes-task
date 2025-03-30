import * as sanitizeHtml from 'sanitize-html';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Publication } from './publication.entity';

enum PublicationTypes {
  Ruling = 'ruling',
}

export interface ExternalPublication {
  id: string;
  highlights: string[];
  type: PublicationTypes;
  categories: string[];
  jnr: string[];
  title: string;
  abstract: string;
  published_date: string; // ISO 8601 format
  date: string; // YYYY-MM-DD format
  is_board_ruling: boolean;
  is_brought_to_court: boolean;
  authority: string;
  body: string;
}

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private publicationRepository: Repository<Publication>,
  ) {}

  async create(publicationData: Partial<Publication>): Promise<Publication> {
    const newPublication = this.publicationRepository.create(publicationData);
    return this.publicationRepository.save(newPublication);
  }

  async getById(id: string): Promise<Publication | null> {
    return this.publicationRepository.findOne({ where: { id } });
  }

  async bulkSavePublications(
    externalPublications: ExternalPublication[],
  ): Promise<void> {
    const publicationIds = externalPublications.map((p) => p.id);

    const existingPublications = await this.publicationRepository.find({
      where: { id: In(publicationIds) },
    });

    const existingPublicationMap = new Map(
      existingPublications.map((p) => [p.id, p]),
    );

    const publicationsToSave: Publication[] = [];

    for (const externalPub of externalPublications) {
      let publication = existingPublicationMap.get(externalPub.id);

      if (!publication) {
        publication = new Publication();
        publication.id = externalPub.id;
      }
      publication.title = externalPub.title;
      publication.type = externalPub.type;
      publication.abstract = externalPub.abstract;
      publication.body = sanitizeHtml(externalPub.body);
      publication.published_date = new Date(externalPub.published_date);
      publication.date = new Date(externalPub.date);
      publication.is_board_ruling = externalPub.is_board_ruling;
      publication.is_brought_to_court = externalPub.is_brought_to_court;
      publication.authority = externalPub.authority;

      publicationsToSave.push(publication);
    }
    await this.publicationRepository.save(publicationsToSave);
  }
}
