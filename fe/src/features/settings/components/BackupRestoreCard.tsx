import React, { useState } from 'react'
import {
  Typography,
  Card,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { TEXTS } from '../constants'

const orangeBorderColor = 'rgba(253, 126, 20, 0.3)'
const orangeMainColor = '#fd7e14'
const orangeDarkColor = '#e8590c'

interface BackupRestoreCardProps {
  onExportData: (format: 'json' | 'csv' | 'pdf') => void
  onImportClick: () => void
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export const BackupRestoreCard: React.FC<BackupRestoreCardProps> = ({
  onExportData,
  onImportClick,
  onImportData,
  fileInputRef,
}) => {
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf'>('json')

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: orangeBorderColor,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: orangeMainColor }}>
        {TEXTS.backupTitle}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {TEXTS.backupSubtitle}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 180, width: { xs: '100%', sm: 'auto' } }}>
          <InputLabel id="export-format-select-label">{TEXTS.exportFormatLabel}</InputLabel>
          <Select
            labelId="export-format-select-label"
            value={format}
            label={TEXTS.exportFormatLabel}
            onChange={(e) => setFormat(e.target.value as 'json' | 'csv' | 'pdf')}
          >
            <MenuItem value="json">{TEXTS.formatJson}</MenuItem>
            <MenuItem value="csv">{TEXTS.formatCsv}</MenuItem>
            <MenuItem value="pdf">{TEXTS.formatPdf}</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Icons.Download />}
          onClick={() => onExportData(format)}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.25,
            fontWeight: 600,
            bgcolor: orangeMainColor,
            color: 'common.white',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              bgcolor: orangeDarkColor,
            },
          }}
        >
          {format === 'json'
            ? TEXTS.btnExportBackup
            : format === 'csv'
              ? TEXTS.btnExportExcel
              : TEXTS.btnPrintPdf}
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Icons.Upload />}
          onClick={onImportClick}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.25,
            fontWeight: 600,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {TEXTS.importBtn}
        </Button>
      </Stack>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImportData}
        accept=".json"
        style={{ display: 'none' }}
      />
    </Card>
  )
}

export default BackupRestoreCard
