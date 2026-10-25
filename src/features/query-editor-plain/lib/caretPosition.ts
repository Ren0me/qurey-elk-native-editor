import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, PADDING } from './constants'

let measured = 0

export function measureCharWidth(): number {
  if (!measured) {
    const ctx = document.createElement('canvas').getContext('2d')
    if (ctx) {
      ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`
      measured = ctx.measureText('0').width
    }
  }
  return measured || FONT_SIZE * 0.6
}

export function caretPosition(
  text: string,
  index: number,
  textarea: HTMLTextAreaElement | null,
): { top: number; left: number } {
  const lines = text.slice(0, index).split('\n')
  const lineIndex = lines.length - 1
  const column = lines[lineIndex].length
  const top = PADDING + (lineIndex + 1) * FONT_SIZE * LINE_HEIGHT
  const left = PADDING + column * measureCharWidth()
  return {
    top: textarea ? top - textarea.scrollTop : top,
    left: textarea ? left - textarea.scrollLeft : left,
  }
}
