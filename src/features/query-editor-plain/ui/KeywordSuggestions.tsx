import { FONT_FAMILY } from '../lib/constants'

type Props = {
  items: string[]
  index: number
  top: number
  left: number
  onHover: (index: number) => void
  onSelect: (index: number) => void
}

export function KeywordSuggestions({
  items,
  index,
  top,
  left,
  onHover,
  onSelect,
}: Props) {
  return (
    <ul
      style={{
        position: 'absolute',
        top,
        left,
        zIndex: 10,
        margin: 0,
        padding: '4px 0',
        listStyle: 'none',
        minWidth: 160,
        maxHeight: 220,
        overflowY: 'auto',
        background: '#ffffff',
        border: '1px solid #d0d0d0',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: FONT_FAMILY,
        fontSize: 13,
        color: '#1f1f1f',
      }}
    >
      {items.map((keyword, itemIndex) => (
        <li
          key={keyword}
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(itemIndex)
          }}
          onMouseEnter={() => onHover(itemIndex)}
          style={{
            padding: '4px 12px',
            cursor: 'pointer',
            background: itemIndex === index ? '#e8f0fe' : 'transparent',
          }}
        >
          {keyword}
        </li>
      ))}
    </ul>
  )
}
