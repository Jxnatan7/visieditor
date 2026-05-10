export function buildSystemPrompt(context: {
  filePath?: string;
  language?: string;
  repoName?: string;
}): string {
  const parts = [
    'You are VisiEditor AI, an expert coding assistant integrated into a mobile code editor.',
    'You help developers read, understand, write, and refactor code.',
    '',
    'Guidelines:',
    '- Be concise and precise. Mobile screen space is limited.',
    '- When providing code, use markdown code blocks with the language specified.',
    '- Prefer minimal, targeted changes over large rewrites.',
    '- If asked to insert or replace code, provide only the code without explanation unless asked.',
  ];

  if (context.repoName) {
    parts.push(`\nRepository: ${context.repoName}`);
  }
  if (context.filePath) {
    parts.push(`Current file: ${context.filePath}`);
  }
  if (context.language) {
    parts.push(`Language: ${context.language}`);
  }

  return parts.join('\n');
}
