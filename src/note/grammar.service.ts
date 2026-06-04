import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

type LanguageToolApiMatch = {
  offset: number;
  length: number;
  message: string;
  shortMessage?: string;
  replacements?: Array<{ value: string }>;
  rule?: {
    id?: string;
    description?: string;
    issueType?: string;
    category?: { id?: string; name?: string };
  };
};

type LanguageToolApiResponse = {
  matches: LanguageToolApiMatch[];
};

export type GrammarMatch = {
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
};

@Injectable()
export class GrammarService {
  private readonly apiUrl =
    process.env.LANGUAGETOOL_API_URL ??
    'https://api.languagetool.org/v2/check';

  async check(text: string, language: string): Promise<GrammarMatch[]> {
    const body = new URLSearchParams({ text, language });

    let response: Response;
    try {
      response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
    } catch {
      throw new ServiceUnavailableException(
        'Could not reach the grammar check service',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Grammar check service returned ${response.status}`,
      );
    }

    const data = (await response.json()) as LanguageToolApiResponse;
    return (data.matches ?? []).map((match) => this.mapMatch(match));
  }

  private mapMatch(match: LanguageToolApiMatch): GrammarMatch {
    return {
      offset: match.offset,
      length: match.length,
      message: match.message,
      shortMessage: match.shortMessage ?? '',
      replacements: (match.replacements ?? []).map((r) => r.value),
      ruleId: match.rule?.id ?? '',
      ruleDescription: match.rule?.description ?? '',
      ruleIssueType: match.rule?.issueType ?? '',
      ruleCategoryId: match.rule?.category?.id ?? '',
      ruleCategoryName: match.rule?.category?.name ?? '',
    };
  }
}
