import { useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { PlainQueryEditor } from '../../query-editor-plain'
import { toCode } from '../lib/toCode'
import { CATEGORY_OPTIONS } from '../model/categories'
import { recordSchema, type RecordForm } from '../model/schema'
import { SelectAutocomplete } from './SelectAutocomplete'
import { TagsField } from './TagsField'

const DEFAULT_VALUES: RecordForm = {
  name: '',
  code: '',
  category: null,
  description: '',
  tags: [],
  query: null,
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: RecordForm) => void
}

export function RecordFormDialog({ open, onClose, onSubmit }: Props) {
  const { control, handleSubmit, reset, watch, setValue } = useForm<RecordForm>({
    resolver: yupResolver(recordSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })

  const name = watch('name')
  const category = watch('category')

  useEffect(() => {
    const nameCode = toCode(name)
    const code =
      nameCode && category?.code ? `${category.code}.${nameCode}` : ''
    setValue('code', code, {
      shouldDirty: true,
      shouldValidate: code.length > 0,
    })
  }, [name, category, setValue])

  const submit = handleSubmit((values) => {
    onSubmit(values)
    reset(DEFAULT_VALUES)
  })

  const handleClose = () => {
    reset(DEFAULT_VALUES)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={submit} noValidate>
        <DialogTitle>Добавить запись</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Name"
                  required
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field, fieldState }) => (
                <SelectAutocomplete
                  options={CATEGORY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  label="Category"
                  required
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="code"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Code"
                  required
                  fullWidth
                  slotProps={{ input: { readOnly: true } }}
                  error={Boolean(fieldState.error)}
                  helperText={
                    fieldState.error?.message ??
                    'Формируется автоматически из name и category'
                  }
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  minRows={3}
                />
              )}
            />

            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => (
                <TagsField
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="query"
              control={control}
              render={({ field, fieldState }) => (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Query *
                  </Typography>
                  <Box sx={{ height: 240, display: 'flex' }}>
                    <PlainQueryEditor
                      value={field.value}
                      onChange={field.onChange}
                      error={Boolean(fieldState.error)}
                    />
                  </Box>
                  {fieldState.error && (
                    <FormHelperText error>
                      {fieldState.error.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>
            Отмена
          </Button>
          <Button type="submit" variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
