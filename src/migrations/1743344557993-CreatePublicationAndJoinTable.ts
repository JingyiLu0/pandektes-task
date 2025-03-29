import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePublicationAndJoinTable1743344557993 implements MigrationInterface {
    name = 'CreatePublicationAndJoinTable1743344557993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "publication" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "highlights" text array, "type" character varying NOT NULL, "jnr" text array, "title" character varying NOT NULL, "abstract" text, "published_date" TIMESTAMP WITH TIME ZONE, "date" date, "is_board_ruling" boolean, "is_brought_to_court" boolean, "authority" character varying, "body" text NOT NULL, CONSTRAINT "PK_8aea8363d5213896a78d8365fab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publication_categories_category" ("id" SERIAL NOT NULL, "publicationId" uuid NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_f23dcd6bf7e4837520aeef49e62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "publication_categories_category" ADD CONSTRAINT "FK_ee1a43cbc085dfa1edb1401436a" FOREIGN KEY ("publicationId") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publication_categories_category" ADD CONSTRAINT "FK_b94c4a85a8cab4e1c3be5cb32fe" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "publication_categories_category" DROP CONSTRAINT "FK_b94c4a85a8cab4e1c3be5cb32fe"`);
        await queryRunner.query(`ALTER TABLE "publication_categories_category" DROP CONSTRAINT "FK_ee1a43cbc085dfa1edb1401436a"`);
        await queryRunner.query(`DROP TABLE "publication_categories_category"`);
        await queryRunner.query(`DROP TABLE "publication"`);
    }

}
