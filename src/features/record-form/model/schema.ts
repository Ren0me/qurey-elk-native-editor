import * as yup from 'yup'
import type { QueryObject } from '../../../shared/query/types'

export const recordSchema = yup.object({
  name: yup.string().trim().required('Введите name'),
  code: yup.string().trim().required('Code обязателен'),
  category: yup
    .object({
      name: yup.string().required(),
      code: yup.string().required(),
    })
    .nullable()
    .defined()
    .test('required', 'Выберите category', (value) => value != null),
  description: yup.string().default(''),
  tags: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Добавьте хотя бы один тег')
    .required('Добавьте хотя бы один тег'),
  query: yup
    .mixed<QueryObject>()
    .nullable()
    .defined()
    .test('required', 'Введите query', (value) => value != null),
})

export type RecordForm = yup.InferType<typeof recordSchema>
