import React, { useState } from 'react'
import { Container, Stack, Typography, Box } from '@/components/ui'
import { GoalForm } from './GoalForm'
import { GoalPanel } from './GoalPanel'
import { GOALS_CONTENT } from '../constants/content'
import type { Goal } from '@/types'

const PAGE_TITLE = GOALS_CONTENT.PAGE_TITLE
const PAGE_DESC = GOALS_CONTENT.PAGE_DESC
const FORM_SECTION_TITLE = GOALS_CONTENT.FORM_TITLE_ADD

export const GoalsPage: React.FC = () => {
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>()

  const handleEditGoal = (goal: Goal): void => {
    setEditingGoal(goal)
  }

  const handleFormSuccess = (): void => {
    setEditingGoal(undefined)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {PAGE_TITLE}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {PAGE_DESC}
          </Typography>
        </Box>

        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {editingGoal ? GOALS_CONTENT.FORM_TITLE_EDIT : FORM_SECTION_TITLE}
            </Typography>
            <GoalForm existingGoal={editingGoal} onSuccess={handleFormSuccess} />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {GOALS_CONTENT.PAGE_TITLE}
            </Typography>
            <GoalPanel onEditGoal={handleEditGoal} />
          </Box>
        </Stack>
      </Stack>
    </Container>
  )
}
