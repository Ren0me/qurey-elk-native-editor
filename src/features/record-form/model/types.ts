import type { RecordForm } from './schema'

export type Category = {
  name: string
  code: string
}

export type RecordRow = RecordForm & {
  id: string
}
