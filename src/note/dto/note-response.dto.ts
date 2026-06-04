import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GrammarMatchDto {
  @ApiProperty({ example: 8 })
  offset: number;

  @ApiProperty({ example: 4 })
  length: number;

  @ApiProperty({ example: 'Possible spelling mistake found' })
  message: string;

  @ApiProperty({ example: 'Spelling mistake' })
  shortMessage: string;

  @ApiProperty({ example: ['wrong', 'long'] })
  replacements: string[];

  @ApiProperty({ example: 'MORFOLOGIK_RULE_EN_US' })
  ruleId: string;

  @ApiProperty({ example: 'Possible spelling mistake' })
  ruleDescription: string;

  @ApiProperty({ example: 'misspelling' })
  ruleIssueType: string;

  @ApiProperty({ example: 'TYPOS' })
  ruleCategoryId: string;

  @ApiProperty({ example: 'Possible Typo' })
  ruleCategoryName: string;
}

export class GrammarCheckDataDto {
  @ApiProperty({ example: 'en-US' })
  language: string;

  @ApiProperty({ example: 'This is wong.' })
  text: string;

  @ApiProperty({ type: [GrammarMatchDto] })
  matches: GrammarMatchDto[];
}

export class GrammarCheckResponseDto {
  @ApiProperty({ example: 'Grammar check completed' })
  message: string;

  @ApiProperty({ type: GrammarCheckDataDto })
  data: GrammarCheckDataDto;
}

export class NoteSummaryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: 'My Note' })
  title: string | null;

  @ApiProperty({ example: '2026-06-03T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-03T00:00:00.000Z' })
  updatedAt: Date;
}

export class SaveNoteResponseDto {
  @ApiProperty({ example: 'Note saved' })
  message: string;

  @ApiProperty({ type: NoteSummaryDto })
  data: NoteSummaryDto;
}

export class ListNotesResponseDto {
  @ApiProperty({ example: 'Notes retrieved' })
  message: string;

  @ApiProperty({ type: [NoteSummaryDto] })
  data: NoteSummaryDto[];
}

export class RenderedNoteDataDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: 'My Note' })
  title: string | null;

  @ApiProperty({ example: '<h1>My Note</h1>\n<p>Hello <strong>world</strong>.</p>\n' })
  html: string;

  @ApiProperty({ example: '2026-06-03T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-03T00:00:00.000Z' })
  updatedAt: Date;
}

export class RenderedNoteResponseDto {
  @ApiProperty({ example: 'Note rendered' })
  message: string;

  @ApiProperty({ type: RenderedNoteDataDto })
  data: RenderedNoteDataDto;
}
