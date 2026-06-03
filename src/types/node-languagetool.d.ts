declare module 'node-languagetool' {
  export function check(
    text: string,
    locale: string,
  ): Promise<{
    code: number;
    matches: Array<Record<string, unknown>>;
  }>;
}
