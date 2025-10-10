import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-d3kje615pdvs739jif50-a',
  port: 5432,
  username: 'postgress',
  password: 'GfrSbCHMbw6jN5VS2wQPEe2kwsENpcJ3',
  database: 'notes_app_y1tp',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
