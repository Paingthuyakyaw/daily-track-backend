import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Markdown content of the note',
    example: '# My Note\n\nHello **world**.',
  })
  markdown: string;

  @ApiPropertyOptional({
    description: 'Optional title; derived from markdown if omitted',
    example: 'My Note',
  })
  title?: string;
}
