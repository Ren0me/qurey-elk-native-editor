import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useQueryField } from '../../../shared/query/useQueryField'
import type { QueryObject } from '../../../shared/query/types'
import { findMatchingBracket, highlightToNodes } from '../lib/queryHighlight'
import { CLOSERS, PAIRS, sharedText } from '../lib/constants'
import { caretPosition } from '../lib/caretPosition'
import { applyKeyword, findKeywordMatch } from '../lib/keywordMenu'
import {
  deletePair,
  insertNewline,
  insertPair,
  insertTab,
  skipClosing,
} from '../lib/textEdit'
import { KeywordSuggestions } from './KeywordSuggestions'

type Props = {
  value: QueryObject | null
  onChange: (value: QueryObject | null) => void
  error?: boolean
}

type Menu = {
  items: string[]
  index: number
  start: number
  end: number
  top: number
  left: number
}

export function PlainQueryEditor({ value, onChange, error }: Props) {
  return <PlainQueryView value={value} onChange={onChange} error={error} />
}

type ViewProps = {
  value: QueryObject | null
  onChange: (value: QueryObject | null) => void
  error?: boolean
}

function PlainQueryView({ value, onChange, error }: ViewProps) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const pendingCaret = useRef<number | null>(null)
  const [caret, setCaret] = useState(0)
  const [menu, setMenu] = useState<Menu | null>(null)
  const { text, update } = useQueryField(value, onChange)

  useEffect(() => {
    const ta = taRef.current
    if (pendingCaret.current != null && ta) {
      ta.selectionStart = pendingCaret.current
      ta.selectionEnd = pendingCaret.current
      pendingCaret.current = null
    }
  }, [text])

  const commit = (next: string, nextCaret: number) => {
    pendingCaret.current = nextCaret
    update(next)
  }

  const match = text ? findMatchingBracket(text, caret) : null

  const updateMenu = (source: string, cursor: number, explicit: boolean) => {
    const found = findKeywordMatch(source, cursor, explicit)
    if (!found) {
      setMenu(null)
      return
    }
    const position = caretPosition(source, found.start, taRef.current)
    setMenu({ ...found, index: 0, ...position })
  }

  const acceptKeyword = (index: number) => {
    if (!menu) return
    const keyword = menu.items[index]
    if (keyword === undefined) return
    const edit = applyKeyword(text, menu, keyword)
    commit(edit.text, edit.caret)
    setMenu(null)
  }

  const handleScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop
      preRef.current.scrollLeft = taRef.current.scrollLeft
    }
    setMenu(null)
  }

  const syncCaret = () => {
    if (taRef.current) setCaret(taRef.current.selectionStart)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart: start, selectionEnd: end } = e.currentTarget

    if (menu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMenu({ ...menu, index: (menu.index + 1) % menu.items.length })
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMenu({
          ...menu,
          index: (menu.index - 1 + menu.items.length) % menu.items.length,
        })
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        acceptKeyword(menu.index)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setMenu(null)
        return
      }
    }

    if (e.key === ' ' && e.ctrlKey) {
      e.preventDefault()
      updateMenu(text, start, true)
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const edit = insertTab(text, start, end)
      commit(edit.text, edit.caret)
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const edit = insertNewline(text, start)
      commit(edit.text, edit.caret)
      return
    }

    if (e.key === 'Backspace') {
      const edit = deletePair(text, start, end)
      if (edit) {
        e.preventDefault()
        commit(edit.text, edit.caret)
      }
      return
    }

    if (CLOSERS.has(e.key) && PAIRS[e.key] === undefined) {
      const edit = skipClosing(text, start, end, e.key)
      if (edit) {
        e.preventDefault()
        commit(edit.text, edit.caret)
      }
      return
    }

    if (PAIRS[e.key] !== undefined) {
      e.preventDefault()
      const skip = skipClosing(text, start, end, e.key)
      if (skip) {
        commit(skip.text, skip.caret)
        return
      }
      const edit = insertPair(text, start, end, e.key)
      commit(edit.text, edit.caret)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        border: 1,
        borderColor: error ? 'error.main' : 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <pre
        ref={preRef}
        aria-hidden
        style={{
          ...sharedText,
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          color: '#1f1f1f',
        }}
      >
        {highlightToNodes(text, match)}
        {'\n'}
      </pre>
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => {
          update(e.target.value)
          updateMenu(e.target.value, e.target.selectionStart, false)
        }}
        onScroll={handleScroll}
        onSelect={syncCaret}
        onClick={syncCaret}
        onKeyUp={syncCaret}
        onKeyDown={handleKeyDown}
        onBlur={() => setMenu(null)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        style={{
          ...sharedText,
          position: 'absolute',
          inset: 0,
          border: 'none',
          outline: 'none',
          resize: 'none',
          background: 'transparent',
          color: 'transparent',
          caretColor: '#1f1f1f',
          overflow: 'auto',
        }}
      />
      {menu && (
        <KeywordSuggestions
          items={menu.items}
          index={menu.index}
          top={menu.top}
          left={menu.left}
          onHover={(index) => setMenu({ ...menu, index })}
          onSelect={acceptKeyword}
        />
      )}
    </Box>
  )
}
