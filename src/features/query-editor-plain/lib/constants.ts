export const FONT_FAMILY =
  '"JetBrains Mono", "Fira Code", Menlo, Consolas, "Courier New", monospace'
export const FONT_SIZE = 14
export const LINE_HEIGHT = 1.5
export const PADDING = 16
export const INDENT = '  '

export const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
}
export const OPENERS = new Set(['(', '[', '{'])
export const CLOSERS = new Set([')', ']', '}', '"', "'"])

export const sharedText: React.CSSProperties = {
  margin: 0,
  padding: PADDING,
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZE,
  lineHeight: LINE_HEIGHT,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  boxSizing: 'border-box',
}
