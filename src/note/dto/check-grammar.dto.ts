import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckGrammarDto {
  @ApiProperty({
    description: 'Text to check (Markdown is stripped before checking)',
    example: 'This is wong.',
  })
  text: string;

  @ApiPropertyOptional({
    description: 'LanguageTool locale',
    example: 'en-US',
    default: 'en-US',
  })
  language?: string;
}
