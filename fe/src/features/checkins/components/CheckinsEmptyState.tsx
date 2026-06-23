import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, EmptyState, Button } from '@/components/ui'
import { CHECKIN_CONTENT } from '../constants'

const NAVIGATE_HABITS = '/habits'

export const CheckinsEmptyState: React.FC<{ hasHabits: boolean }> = ({ hasHabits }) => {
  const navigate = useNavigate()

  if (hasHabits) {
    return <EmptyState message={CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS_SCHEDULED} />
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 2 }}>
      <EmptyState
        message={`${CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS_TITLE}. ${CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS_CTA}`}
      />
      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={() => navigate(NAVIGATE_HABITS)}
        sx={{ borderRadius: 2 }}
      >
        {CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS_CTA}
      </Button>
    </Box>
  )
}
