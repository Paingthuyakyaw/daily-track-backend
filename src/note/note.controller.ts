import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/decorators/current-user.decorator';
import { CheckGrammarDto } from './dto/check-grammar.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import {
  GrammarCheckResponseDto,
  ListNotesResponseDto,
  RenderedNoteResponseDto,
  SaveNoteResponseDto,
} from './dto/note-response.dto';
import { NoteService } from './note.service';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('grammar-check')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Check grammar',
    description:
      'Checks grammar for the logged-in user. Markdown syntax is stripped before checking.',
  })
  @ApiOkResponse({ type: GrammarCheckResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiBadRequestResponse({ description: 'Missing or empty text' })
  @ApiServiceUnavailableResponse({
    description: 'Grammar check service unreachable or returned an error',
  })
  async checkGrammar(
    @CurrentUser() _user: AuthUser,
    @Body() dto: CheckGrammarDto,
  ) {
    const data = await this.noteService.checkGrammar(dto);
    return {
      message: 'Grammar check completed',
      data,
    };
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Save a note',
    description: 'Stores Markdown for the authenticated user only.',
  })
  @ApiCreatedResponse({ type: SaveNoteResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiBadRequestResponse({ description: 'Missing or empty markdown' })
  async saveNote(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateNoteDto,
  ) {
    const data = await this.noteService.createNote(user.id, dto);
    return {
      message: 'Note saved',
      data,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'List my notes',
    description: 'Returns only notes belonging to the authenticated user.',
  })
  @ApiOkResponse({ type: ListNotesResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  async listNotes(@CurrentUser() user: AuthUser) {
    const data = await this.noteService.listNotes(user.id);
    return {
      message: 'Notes retrieved',
      data,
    };
  }

  @Get(':id/html')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get rendered HTML',
    description: 'Renders a note as HTML if it belongs to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Note UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ type: RenderedNoteResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiNotFoundResponse({ description: 'Note not found or not owned by user' })
  async getRenderedHtml(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    const data = await this.noteService.getRenderedHtml(user.id, id);
    return {
      message: 'Note rendered',
      data,
    };
  }
}
