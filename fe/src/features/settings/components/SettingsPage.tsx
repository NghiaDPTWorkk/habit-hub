import React from 'react'
import { Box, Typography } from '@/components/ui'

const TEXTS = {
  title: 'Settings & Backups',
}

export const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">{TEXTS.title}</Typography>
    </Box>
  )
}

export default SettingsPage
