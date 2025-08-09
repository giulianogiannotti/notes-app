import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategoriesAndTables1754725832699
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "note" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        content TEXT,
        user_id UUID REFERENCES "user"(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "category" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS note_category (
        note_id UUID REFERENCES note(id) ON DELETE CASCADE,
        category_id UUID REFERENCES category(id) ON DELETE CASCADE,
        PRIMARY KEY (note_id, category_id)
      );
    `);

    await queryRunner.query(`
      INSERT INTO category (id, name) VALUES
      (uuid_generate_v4(), 'compras'),
      (uuid_generate_v4(), 'hogar'),
      (uuid_generate_v4(), 'hobbies'),
      (uuid_generate_v4(), 'estudios');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM category WHERE name IN ('compras', 'hogar', 'hobbies', 'estudios');`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS note_category;`);
    await queryRunner.query(`DROP TABLE IF EXISTS note;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
    await queryRunner.query(`DROP TABLE IF EXISTS category;`);
  }
}
