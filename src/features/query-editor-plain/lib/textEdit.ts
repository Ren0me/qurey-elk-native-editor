import { INDENT, OPENERS, PAIRS } from './constants'

export type TextEdit = { text: string; caret: number }

export function insertTab(text: string, start: number, end: number): TextEdit {
  return {
    text: text.slice(0, start) + INDENT + text.slice(end),
    caret: start + INDENT.length,
  }
}

export function insertNewline(text: string, start: number): TextEdit {
  const lineStart = text.lastIndexOf('\n', start - 1) + 1
  const line = text.slice(lineStart, start)
  const baseIndent = line.match(/^[ \t]*/)?.[0] ?? ''
  const before = text[start - 1]
  const after = text[start]
  const opens = before !== undefined && OPENERS.has(before)

  if (opens && after === PAIRS[before]) {
    const insert = '\n' + baseIndent + INDENT + '\n' + baseIndent
    return {
      text: text.slice(0, start) + insert + text.slice(start),
      caret: start + 1 + baseIndent.length + INDENT.length,
    }
  }

  const indent = baseIndent + (opens ? INDENT : '')
  const insert = '\n' + indent
  return {
    text: text.slice(0, start) + insert + text.slice(start),
    caret: start + insert.length,
  }
}

export function deletePair(
  text: string,
  start: number,
  end: number,
): TextEdit | null {
  const before = text[start - 1]
  const after = text[start]
  if (start !== end || before === undefined || after === undefined) return null
  if (PAIRS[before] !== after) return null
  return {
    text: text.slice(0, start - 1) + text.slice(start + 1),
    caret: start - 1,
  }
}

export function skipClosing(
  text: string,
  start: number,
  end: number,
  key: string,
): TextEdit | null {
  if (start !== end || text[start] !== key) return null
  return { text, caret: start + 1 }
}

export function insertPair(
  text: string,
  start: number,
  end: number,
  key: string,
): TextEdit {
  const close = PAIRS[key]
  if (start !== end) {
    const selected = text.slice(start, end)
    return {
      text: text.slice(0, start) + key + selected + close + text.slice(end),
      caret: start + 1,
    }
  }
  return {
    text: text.slice(0, start) + key + close + text.slice(end),
    caret: start + 1,
  }
}
