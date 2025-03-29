import { Category } from '../categories/category.entity';
import { Publication } from '../publications/publication.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity('publication_categories_category')
export class PublicationCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Publication, { onDelete: 'CASCADE', nullable: false })
  publication: Publication;

  @ManyToOne(() => Category, { onDelete: 'CASCADE', nullable: false })
  category: Category;
}
