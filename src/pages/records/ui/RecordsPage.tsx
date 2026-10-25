import { useMemo, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import {
  RecordFormDialog,
  type RecordForm,
  type RecordRow,
} from '../../../features/record-form'
import { serializeQuery } from '../../../shared/query/parseQuery'

export function RecordsPage() {
  const [records, setRecords] = useState<RecordRow[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const columns = useMemo<MRT_ColumnDef<RecordRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 180,
      },
      {
        id: 'category',
        accessorFn: (row) => row.category?.name ?? '',
        header: 'Category',
        size: 140,
      },
      {
        accessorKey: 'code',
        header: 'Code',
        size: 160,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 240,
        Cell: ({ row }) => row.original.description || '—',
      },
      {
        id: 'tags',
        accessorFn: (row) => row.tags.join(', '),
        header: 'Tags',
        size: 220,
        Cell: ({ row }) =>
          row.original.tags.length > 0 ? (
            <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {row.original.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Stack>
          ) : (
            '—'
          ),
      },
      {
        id: 'query',
        accessorFn: (row) => serializeQuery(row.query),
        header: 'Query',
        size: 320,
        Cell: ({ row }) => (
          <Box
            component="pre"
            sx={{
              m: 0,
              maxHeight: 120,
              maxWidth: 320,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: 12,
              whiteSpace: 'pre-wrap',
            }}
          >
            {serializeQuery(row.original.query)}
          </Box>
        ),
      },
    ],
    [],
  )

  const handleAdd = (values: RecordForm) => {
    setRecords((prev) => [{ id: crypto.randomUUID(), ...values }, ...prev])
    setDialogOpen(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Записи
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Добавить запись
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, p: 2 }}>
        <MaterialReactTable
          columns={columns}
          data={records}
          getRowId={(row) => row.id}
          localization={MRT_Localization_RU}
          enableRowSelection={false}
          initialState={{
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 10 },
          }}
          muiTablePaperProps={{ elevation: 1, sx: { borderRadius: 2 } }}
          renderEmptyRowsFallback={() => (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              Записей пока нет. Нажмите «Добавить запись».
            </Box>
          )}
        />
      </Box>

      <RecordFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAdd}
      />
    </Box>
  )
}
