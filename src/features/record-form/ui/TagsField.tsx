import { useState } from 'react'
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

type Props = {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function TagsField({ value, onChange, error }: Props) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim()
    if (!tag) return
    if (!value.includes(tag)) {
      onChange([...value, tag])
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag))
  }

  return (
    <Box>
      <TextField
        label="Tags"
        required
        fullWidth
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            addTag()
          }
        }}
        error={Boolean(error)}
        helperText={error}
        placeholder="Введите тег"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  edge="end"
                  aria-label="Добавить тег"
                  onClick={addTag}
                  disabled={!input.trim()}
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      {value.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap', mt: 1 }}
        >
          {value.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => removeTag(tag)}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}
