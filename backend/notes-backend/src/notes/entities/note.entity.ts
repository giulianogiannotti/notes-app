import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isArchived: boolean;

  @ManyToMany(() => Category, (category) => category.notes)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  owner: User;
}
