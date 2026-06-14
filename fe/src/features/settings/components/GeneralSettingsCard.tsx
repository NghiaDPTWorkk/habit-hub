import React from 'react'
import { Box, Typography, Card, Switch, Stack } from '@/components/ui'
import { TEXTS } from '../constants'

interface GeneralSettingsCardProps {
  readOnly: boolean
  onReadOnlyChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const GeneralSettingsCard: React.FC<GeneralSettingsCardProps> = ({
  readOnly,
  onReadOnlyChange,
}) => {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {TEXTS.generalTitle}
      </Typography>

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ pr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {TEXTS.readOnlyTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {TEXTS.readOnlySubtitle}
            </Typography>
          </Box>
          <Switch checked={readOnly} onChange={onReadOnlyChange} />
        </Box>
      </Stack>
    </Card>
  )
}

export default GeneralSettingsCard
