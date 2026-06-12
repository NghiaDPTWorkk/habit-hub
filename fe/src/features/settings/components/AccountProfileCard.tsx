import React from 'react'
import { Box, Typography, Card, TextField, Stack } from '@/components/ui'
import { TEXTS } from '../constants'

interface AccountProfileCardProps {
  fullName: string
  email: string
  subTier: string
}

export const AccountProfileCard: React.FC<AccountProfileCardProps> = ({
  fullName,
  email,
  subTier,
}) => {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        {TEXTS.profileTitle}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {TEXTS.profileSubtitle}
      </Typography>

      <Stack spacing={2.5}>
        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}
          >
            {TEXTS.fullNameLabel}
          </Typography>
          <TextField
            value={fullName}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            fullWidth
          />
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}
          >
            {TEXTS.emailLabel}
          </Typography>
          <TextField
            value={email}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            fullWidth
          />
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}
          >
            {TEXTS.subTierLabel}
          </Typography>
          <TextField
            value={subTier}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            fullWidth
          />
        </Box>
      </Stack>
    </Card>
  )
}

export default AccountProfileCard
