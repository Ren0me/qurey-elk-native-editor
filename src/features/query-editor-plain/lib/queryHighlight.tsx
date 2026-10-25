import type { CSSProperties, ReactNode } from 'react'

export type TokenType =
  | 'key'
  | 'string'
  | 'number'
  | 'boolean'
  | 'keyword'
  | 'punctuation'
  | 'plain'

type Token = { type: TokenType; start: number; end: number }

const KEYWORDS = new Set([
  'term',
  'terms',
  'range',
  'match',
  'match_all',
  'match_phrase',
  'multi_match',
  'bool',
  'must',
  'must_not',
  'should',
  'filter',
  'minimum_should_match',
  'query',
  'aggs',
  'aggregations',
  'from',
  'size',
  'sort',
  'order',
  'gte',
  'lte',
  'gt',
  'lt',
  'boost',
  'wildcard',
  'prefix',
  'exists',
  'nested',
  'highlight',
  'script',
  'field',
])

const OPENERS = '([{'
const CLOSERS = ')]}'

const PAIRS: Record<string, string> = { '(': ')', '[': ']', '{': '}' }
const REVERSE: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

const TOKEN_COLORS: Record<TokenType, string | null> = {
  key: '#0451a5',
  string: '#a31515',
  number: '#098658',
  boolean: '#0000ff',
  keyword: '#af00db',
  punctuation: '#666666',
  plain: null,
}

const isDigit = (c: string) => c >= '0' && c <= '9'
const isWordStart = (c: string) => /[A-Za-z_$@]/.test(c)
const isWordPart = (c: string) => /[\w$@.-]/.test(c)

export function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = text.length

  const push = (type: TokenType, start: number, end: number) => {
    const last = tokens[tokens.length - 1]
    if (last && last.type === 'plain' && type === 'plain' && last.end === start) {
      last.end = end
      return
    }
    tokens.push({ type, start, end })
  }

  while (i < n) {
    const ch = text[i]

    if (ch === '"' || ch === "'") {
      const start = i
      i++
      while (i < n) {
        if (text[i] === '\\') {
          i += 2
          continue
        }
        if (text[i] === ch) {
          i++
          break
        }
        i++
      }
      let j = i
      while (j < n && /\s/.test(text[j])) j++
      push(text[j] === ':' ? 'key' : 'string', start, i)
      continue
    }

    if (isDigit(ch) || (ch === '-' && isDigit(text[i + 1] ?? ''))) {
      const start = i
      i++
      while (i < n && /[0-9.eE+-]/.test(text[i])) i++
      push('number', start, i)
      continue
    }

    if (isWordStart(ch)) {
      const start = i
      i++
      while (i < n && isWordPart(text[i])) i++
      const word = text.slice(start, i).toLowerCase()
      let type: TokenType = 'plain'
      if (word === 'true' || word === 'false' || word === 'null') type = 'boolean'
      else if (KEYWORDS.has(word)) type = 'keyword'
      push(type, start, i)
      continue
    }

    if (
      OPENERS.includes(ch) ||
      CLOSERS.includes(ch) ||
      ch === ':' ||
      ch === ',' ||
      ch === ';'
    ) {
      push('punctuation', i, i + 1)
      i++
      continue
    }

    push('plain', i, i + 1)
    i++
  }

  return tokens
}

export function findMatchingBracket(
  text: string,
  caret: number,
): [number, number] | null {
  for (const pos of [caret - 1, caret]) {
    if (pos < 0 || pos >= text.length) continue
    const ch = text[pos]

    if (PAIRS[ch]) {
      const close = PAIRS[ch]
      let depth = 0
      for (let i = pos; i < text.length; i++) {
        if (text[i] === ch) depth++
        else if (text[i] === close) {
          depth--
          if (depth === 0) return [pos, i]
        }
      }
    } else if (REVERSE[ch]) {
      const open = REVERSE[ch]
      let depth = 0
      for (let i = pos; i >= 0; i--) {
        if (text[i] === ch) depth++
        else if (text[i] === open) {
          depth--
          if (depth === 0) return [i, pos]
        }
      }
    }
  }
  return null
}

export function highlightToNodes(
  text: string,
  match: [number, number] | null,
): ReactNode[] {
  return tokenize(text).map((token, idx) => {
    const color = TOKEN_COLORS[token.type]
    const isMatch =
      match !== null && (token.start === match[0] || token.start === match[1])
    const content = text.slice(token.start, token.end)

    if (!color && !isMatch) return content

    const style: CSSProperties = {}
    if (color) style.color = color
    if (isMatch) {
      style.background = 'rgba(255, 196, 0, 0.45)'
      style.borderRadius = 2
    }

    return (
      <span key={idx} style={style}>
        {content}
      </span>
    )
  })
}
