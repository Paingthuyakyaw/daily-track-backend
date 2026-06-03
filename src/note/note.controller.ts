import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CheckGrammarDto } from './dto/check-grammar.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('grammar-check')
  @HttpCode(200)
  async checkGrammar(@Body() dto: CheckGrammarDto) {
    const data = await this.noteService.checkGrammar(dto);
    return {
      message: 'Grammar check completed',
      data,
    };
  }

  @Post()
  @HttpCode(201)
  async saveNote(@Body() dto: CreateNoteDto) {
    const data = await this.noteService.createNote(dto);
    return {
      message: 'Note saved',
      data,
    };
  }

  @Get()
  @HttpCode(200)
  async listNotes() {
    const data = await this.noteService.listNotes();
    return {
      message: 'Notes retrieved',
      data,
    };
  }

  @Get(':id/html')
  @HttpCode(200)
  async getRenderedHtml(@Param('id') id: string) {
    const data = await this.noteService.getRenderedHtml(id);
    return {
      message: 'Note rendered',
      data,
    };
  }
}
