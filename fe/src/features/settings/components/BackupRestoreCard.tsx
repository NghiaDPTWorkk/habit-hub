import React from 'react'
import { Typography, Card, Stack, Button } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { TEXTS } from '../constants'

const orangeBorderColor = 'rgba(253, 126, 20, 0.3)'
const orangeMainColor = '#fd7e14'
const orangeDarkColor = '#e8590c'

interface BackupRestoreCardProps {
  onExportData: () => void
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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          startIcon={<Icons.Download />}
          onClick={onExportData}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.25,
            fontWeight: 600,
            bgcolor: orangeMainColor,
            color: 'common.white',
            '&:hover': {
              bgcolor: orangeDarkColor,
            },
          }}
        >
          {TEXTS.exportBtn}
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
