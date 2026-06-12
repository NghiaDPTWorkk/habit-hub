import React from 'react'
import Alert from '@mui/material/Alert'
import { Typography, Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

const HABITS_ROUTE = '/habits'
const VIEW_HABITS_LABEL = 'View habits'
const BANNER_SUFFIX = 'habit(s) at risk today'

export interface AtRiskBannerProps {
  count: number
  habitNames: string[]
}

export const AtRiskBanner: React.FC<AtRiskBannerProps> = ({ count, habitNames }) => {
  const navigate = useNavigate()
  if (count === 0) return null

  const title = `${count} ${BANNER_SUFFIX}`
  const names = habitNames.join(', ')

  return (
    <Alert
      severity="warning"
      action={
        <Button size="small" color="warning" onClick={() => navigate(HABITS_ROUTE)}>
          {VIEW_HABITS_LABEL}
        </Button>
      }
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {names}
      </Typography>
    </Alert>
  )
}

export default AtRiskBanner
