import {buildQueryTokens, tokenize} from '../src/data/index/tokenizer';

describe('tokenizer', () => {
  it('normalizes Russian text and strips stop words', () => {
    const tokens = tokenize('Гражданское законодательство и право');
    expect(tokens.map(t => t.term)).toEqual([
      'гражданское',
      'граж*',
      'законодательство',
      'зак*',
      'право',
      'прав*',
    ]);
  });

  it('builds query tokens without weights', () => {
    expect(buildQueryTokens('Гражданский кодекс')).toEqual(['гражданский', 'кодекс']);
  });
});
