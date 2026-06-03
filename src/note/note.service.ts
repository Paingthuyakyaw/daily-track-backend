import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { marked } from 'marked';
import * as languageTool from 'node-languagetool';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckGrammarDto } from './dto/check-grammar.dto';
import { CreateNoteDto } from './dto/create-note.dto';

type LanguageToolResult = {
  code: number;
  matches: Array<{
    offset: number;
    length: number;
    message: string;
    shortMessage: string;
    replacements: string[];
    ruleId: string;
    ruleDescription: string;
    ruleIssueType: string;
    ruleCategoryId: string;
    ruleCategoryName: string;
  }>;
};

const runGrammarCheck = (
  text: string,
  language: string,
): Promise<LanguageToolResult> =>
  languageTool.check(text, language) as Promise<LanguageToolResult>;

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  async checkGrammar(dto: CheckGrammarDto) {
    const text = dto.text?.trim();
    if (!text) {
      throw new BadRequestException('text is required');
    }

    const language = dto.language?.trim() || 'en-US';
    const plainText = this.stripMarkdown(text);
    const result = await runGrammarCheck(plainText, language);

    return {
      language,
      text: plainText,
      matches: result.matches,
    };
  }

  async createNote(dto: CreateNoteDto) {
    const markdown = dto.markdown?.trim();
    if (!markdown) {
      throw new BadRequestException('markdown is required');
    }

    const title =
      dto.title?.trim() || this.deriveTitleFromMarkdown(markdown) || null;

    return this.prisma.note.create({
      data: {
        title,
        content: markdown,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async listNotes() {
    return this.prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getRenderedHtml(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id "${id}" not found`);
    }

    const html = await marked.parse(note.content);

    return {
      id: note.id,
      title: note.title,
      html,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  private deriveTitleFromMarkdown(markdown: string): string | undefined {
    const heading = markdown.match(/^#\s+(.+)$/m);
    if (heading?.[1]) {
      return heading[1].trim();
    }

    const firstLine = markdown
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.length > 0);

    if (!firstLine) {
      return undefined;
    }

    return firstLine.replace(/^#+\s*/, '').slice(0, 120);
  }

  private stripMarkdown(markdown: string): string {
    return markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_~>#-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
