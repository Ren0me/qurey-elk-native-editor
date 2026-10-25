import type { QueryObject } from './types'

function isPlainObject(value: unknown): value is QueryObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function relaxToJson(text: string): string {
  return text
    .replace(/([{,]\s*)([A-Za-z_$][\w$.-]*)(\s*:)/g, '$1"$2"$3')
    .replace(/,(\s*[}\]])/g, '$1')
}

export function parseQuery(text: string): QueryObject | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  try {
    const value: unknown = JSON.parse(trimmed)
    return isPlainObject(value) ? value : null
  } catch {
    try {
      const value: unknown = JSON.parse(relaxToJson(trimmed))
      return isPlainObject(value) ? value : null
    } catch {
      return null
    }
  }
}

export function serializeQuery(value: QueryObject | null): string {
  return value ? JSON.stringify(value, null, 2) : ''
}
