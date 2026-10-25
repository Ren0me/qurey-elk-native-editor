import { DSL_KEYWORDS } from '../../../shared/query/keywords'

export type KeywordMatch = {
  items: string[]
  start: number
  end: number
}

export function findKeywordMatch(
  text: string,
  cursor: number,
  explicit: boolean,
): KeywordMatch | null {
  const prefix = text.slice(0, cursor).match(/[\w$@.-]*$/)?.[0] ?? ''
  const wordStart = cursor - prefix.length
  const stripped = text.slice(0, wordStart).replace(/[ \t]*$/, '')
  const prevChar = stripped.slice(-1)
  const insideQuote = prevChar === '"' || prevChar === "'"
  const atStart = stripped === '' || insideQuote || /[{[\n,:]/.test(prevChar)

  if (!atStart || (!explicit && prefix.length === 0)) return null

  const items = DSL_KEYWORDS.filter((keyword) =>
    keyword.startsWith(prefix.toLowerCase()),
  )
  if (items.length === 0) return null

  return { items, start: wordStart, end: cursor }
}

export function applyKeyword(
  text: string,
  match: { start: number; end: number },
  keyword: string,
): { text: string; caret: number } {
  return {
    text: text.slice(0, match.start) + keyword + text.slice(match.end),
    caret: match.start + keyword.length,
  }
}
