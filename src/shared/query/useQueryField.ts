import { useEffect, useRef, useState } from 'react'
import { parseQuery, serializeQuery } from './parseQuery'
import type { QueryObject } from './types'

export function useQueryField(
  value: QueryObject | null,
  onChange: (value: QueryObject | null) => void,
) {
  const [text, setText] = useState(() => serializeQuery(value))
  const textRef = useRef(text)
  const lastExternal = useRef<QueryObject | null>(value)

  useEffect(() => {
    textRef.current = text
  }, [text])

  useEffect(() => {
    if (value === lastExternal.current) return
    const fromText = parseQuery(textRef.current)
    if (JSON.stringify(value) === JSON.stringify(fromText)) return
    lastExternal.current = value
    setText(serializeQuery(value))
  }, [value])

  const update = (next: string) => {
    setText(next)
    onChange(parseQuery(next))
  }

  return { text, update }
}
