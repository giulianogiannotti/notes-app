import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-d2bivr1r0fns73folq9g-a',
  port: 5432,
  username: 'giuliano',
  password: 'I5XunMtp06asbP3GFXoFhCjT3VRwR4Jx',
  database: 'mis_notas',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
