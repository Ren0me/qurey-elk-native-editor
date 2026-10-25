import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import type { Category } from '../model/types'

type Props = {
  options: Category[]
  value: Category | null
  onChange: (value: Category | null) => void
  label: string
  error?: boolean
  helperText?: string
  required?: boolean
}

export function SelectAutocomplete({
  options,
  value,
  onChange,
  label,
  error,
  helperText,
  required,
}: Props) {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, next) => onChange(next)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, current) => option.code === current.code}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props
        return (
          <Box component="li" key={key} {...optionProps}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">{option.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {option.code}
              </Typography>
            </Box>
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
      fullWidth
      autoHighlight
      openOnFocus
      noOptionsText="Нет вариантов"
    />
  )
}
