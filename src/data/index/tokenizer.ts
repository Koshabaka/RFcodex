const STOP_WORDS = new Set([
  'и',
  'в',
  'во',
  'не',
  'что',
  'он',
  'на',
  'я',
  'с',
  'со',
  'как',
  'а',
  'то',
  'все',
  'она',
  'так',
  'его',
  'но',
  'да',
  'ты',
  'к',
  'у',
  'же',
  'вы'
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ё]/g, 'е')
    .replace(/[^a-zа-я0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface Token {
  term: string;
  position: number;
}

export function tokenize(text: string): Token[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }
  const tokens: Token[] = [];
  const parts = normalized.split(' ');
  for (let i = 0; i < parts.length; i++) {
    const term = parts[i];
    if (!term || STOP_WORDS.has(term)) {
      continue;
    }
    tokens.push({term, position: i});
    // add prefix tokens for quick prefix search
    if (term.length > 3) {
      const prefix = term.slice(0, 3);
      tokens.push({term: `${prefix}*`, position: i});
    }
  }
  return tokens;
}

export function tokenizeWithFieldBoost(
  title: string,
  breadcrumbs: string[],
  number: string,
  body: string
): Token[] {
  const tokens: Token[] = [];
  const pushTokens = (source: string, weightMultiplier: number) => {
    tokenize(source).forEach(t => {
      tokens.push({term: `${t.term}:${weightMultiplier}`, position: t.position});
    });
  };

  pushTokens(title, 3);
  breadcrumbs.forEach((crumb, index) => pushTokens(crumb, Math.max(1, 2 - index * 0.3)));
  pushTokens(number, 2);
  pushTokens(body, 1);

  return tokens;
}

export function stripWeight(term: string): {term: string; weight: number} {
  const parts = term.split(':');
  if (parts.length === 2) {
    return {term: parts[0], weight: Number(parts[1]) || 1};
  }
  return {term, weight: 1};
}

export function buildQueryTokens(query: string): string[] {
  return tokenize(query).map(t => t.term.replace(/:.*$/, ''));
}

