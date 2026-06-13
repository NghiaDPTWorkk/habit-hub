import React from 'react'
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Stack,
  Divider,
} from '@/components/ui'
import { TEXTS } from '../constants'

interface GeneralSettingsCardProps {
  readOnly: boolean
  timezone: string
  onReadOnlyChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTimezoneChange: (e: { target: { value: string } }) => void
}

export const GeneralSettingsCard: React.FC<GeneralSettingsCardProps> = ({
  readOnly,
  timezone,
  onReadOnlyChange,
  onTimezoneChange,
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

        <Divider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {TEXTS.timezoneTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {TEXTS.timezoneSubtitle}
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select value={timezone} onChange={onTimezoneChange}>
              <MenuItem value="GMT+7 (Default)">{TEXTS.tzGmt7}</MenuItem>
              <MenuItem value="GMT+0 (UTC)">{TEXTS.tzGmt0}</MenuItem>
              <MenuItem value="GMT-5 (EST)">{TEXTS.tzGmt5}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Card>
  )
}

export default GeneralSettingsCard
