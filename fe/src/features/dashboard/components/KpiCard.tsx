import React from 'react'
import { Box, Typography } from '@/components/ui'
import { Card } from '@/components/ui'

export interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  iconColor?: string
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, iconColor }) => {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
      {icon && (
        <Box sx={{ color: iconColor ?? 'primary.main', opacity: 0.85, display: 'flex' }}>
          {icon}
        </Box>
      )}
    </Card>
  )
}

export default KpiCard
