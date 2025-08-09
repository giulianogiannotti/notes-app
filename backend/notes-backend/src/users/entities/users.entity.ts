import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Note, (note) => note.owner)
  notes: Note[];
}
