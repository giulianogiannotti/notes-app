import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Note } from './entities/note.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllForUser(userId: string): Promise<Note[]> {
    return this.notesRepository.find({
      where: { owner: { id: userId } },
      relations: ['categories', 'owner'],
    });
  }

  async findAllActiveForUser(userId: string): Promise<Note[]> {
    return this.notesRepository.find({
      where: { isArchived: false, owner: { id: userId } },
      relations: ['categories', 'owner'],
    });
  }

  async findAllArchivedForUser(userId: string): Promise<Note[]> {
    return this.notesRepository.find({
      where: { isArchived: true, owner: { id: userId } },
      relations: ['categories', 'owner'],
    });
  }

  async createForUser(userId: string, noteData: Partial<Note>): Promise<Note> {
    const owner = await this.userRepository.findOneBy({ id: userId });
    if (!owner) throw new Error(`Usuario con id ${userId} no encontrado`);

    const note = this.notesRepository.create({
      title: noteData.title,
      content: noteData.content,
      isArchived: noteData.isArchived ?? false,
      owner,
    });

    if (noteData.categories && noteData.categories.length > 0) {
      const categoryIds = noteData.categories.map((c) => c.id);
      note.categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
    }

    return this.notesRepository.save(note);
  }

  async archiveForUser(userId: string, id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!note) throw new Error('Note not found');
    note.isArchived = true;
    return this.notesRepository.save(note);
  }

  async unarchiveForUser(userId: string, id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!note) throw new Error('Note not found');
    note.isArchived = false;
    return this.notesRepository.save(note);
  }

  async updateForUser(
    userId: string,
    id: string,
    noteData: Partial<Note>,
  ): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ['categories'],
    });
    if (!note) throw new Error(`Note with id ${id} not found`);

    if (noteData.title !== undefined) note.title = noteData.title;
    if (noteData.content !== undefined) note.content = noteData.content;
    if (noteData.isArchived !== undefined)
      note.isArchived = noteData.isArchived;

    if (noteData.categories !== undefined) {
      if (noteData.categories.length > 0) {
        const categoryIds = noteData.categories.map((c) => c.id);
        note.categories = await this.categoryRepository.findByIds(categoryIds);
      } else {
        note.categories = [];
      }
    }

    return this.notesRepository.save(note);
  }

  async removeForUser(userId: string, id: string): Promise<void> {
    const note = await this.notesRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!note) throw new Error('Note not found');
    await this.notesRepository.delete(id);
  }
}
