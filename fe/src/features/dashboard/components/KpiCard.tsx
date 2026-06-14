import React from 'react'
import { Box, Typography } from '@/components/ui'
import { Card } from '@/components/ui'
import { alpha } from '@mui/material/styles'

export interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  iconColor?: string
  iconBg?: string
}

type PaletteColor = 'primary' | 'secondary' | 'success' | 'warning' | 'info'

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, iconColor, iconBg }) => {
  const colorPalette = (iconColor?.split('.')[0] || 'primary') as PaletteColor

  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette[colorPalette].main, 0.08),
        border: '1px solid',
        borderColor: (theme) => alpha(theme.palette[colorPalette].main, 0.15),
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
      {icon && (
        <Box
          sx={{
            color: iconColor ?? 'primary.main',
            bgcolor: iconBg,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      )}
    </Card>
  )
}

export default KpiCard
