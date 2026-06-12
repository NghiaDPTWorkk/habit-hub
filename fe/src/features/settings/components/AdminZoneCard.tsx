import React from 'react'
import { Typography, Card, Stack, Button, Divider } from '@/components/ui'
import { TEXTS } from '../constants'

const redBorderColor = 'rgba(250, 82, 82, 0.3)'
const redMainColor = '#fa5252'
const pinkBackgroundColor = 'rgba(250, 82, 82, 0.05)'
const pinkHoverColor = 'rgba(250, 82, 82, 0.12)'

interface AdminZoneCardProps {
  onWipeData: () => void
  onLoadSeedData: () => void
}

export const AdminZoneCard: React.FC<AdminZoneCardProps> = ({ onWipeData, onLoadSeedData }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: redBorderColor,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: redMainColor }}>
        {TEXTS.adminTitle}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {TEXTS.adminSubtitle}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={onWipeData}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.25,
            fontWeight: 600,
            borderColor: redBorderColor,
            color: redMainColor,
            bgcolor: pinkBackgroundColor,
            '&:hover': {
              borderColor: redMainColor,
              bgcolor: pinkHoverColor,
            },
          }}
        >
          {TEXTS.wipeBtn}
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          onClick={onLoadSeedData}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.25,
            fontWeight: 600,
          }}
        >
          {TEXTS.seedBtn}
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {TEXTS.lighthouseText}
      </Typography>
    </Card>
  )
}

export default AdminZoneCard
