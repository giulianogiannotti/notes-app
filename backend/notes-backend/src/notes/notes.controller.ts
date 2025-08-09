import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('all')
  getNotes(@Request() req): Promise<Note[]> {
    return this.notesService.findAllForUser(req.user.userId);
  }

  @Get('active')
  getActiveNotes(@Request() req): Promise<Note[]> {
    return this.notesService.findAllActiveForUser(req.user.userId);
  }

  @Get('archived')
  getArchivedNotes(@Request() req): Promise<Note[]> {
    return this.notesService.findAllArchivedForUser(req.user.userId);
  }

  @Post()
  createNote(@Request() req, @Body() noteData: Partial<Note>): Promise<Note> {
    return this.notesService.createForUser(req.user.userId, noteData);
  }

  @Patch(':id/archive')
  archiveNote(@Request() req, @Param('id') id: string): Promise<Note> {
    return this.notesService.archiveForUser(req.user.userId, id);
  }

  @Patch(':id/unarchive')
  unarchiveNote(@Request() req, @Param('id') id: string): Promise<Note> {
    return this.notesService.unarchiveForUser(req.user.userId, id);
  }

  @Patch(':id')
  updateNote(
    @Request() req,
    @Param('id') id: string,
    @Body() noteData: Partial<Note>,
  ): Promise<Note> {
    return this.notesService.updateForUser(req.user.userId, id, noteData);
  }

  @Delete(':id')
  deleteNote(@Request() req, @Param('id') id: string): Promise<void> {
    return this.notesService.removeForUser(req.user.userId, id);
  }
}
