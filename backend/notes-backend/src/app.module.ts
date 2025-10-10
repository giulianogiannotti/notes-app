import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { Note } from './notes/entities/note.entity';
import { User } from './users/entities/users.entity';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d3kje615pdvs739jif50-a',
      port: 5432,
      username: 'postgress',
      password: 'GfrSbCHMbw6jN5VS2wQPEe2kwsENpcJ3',
      database: 'notes_app_y1tp',
      entities: [Note, Category, User],
      synchronize: false,
    }),
    NotesModule,
    CategoriesModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
