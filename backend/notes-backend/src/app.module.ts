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
      host: process.env.HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [Note, Category, User],
      synchronize: true,
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
