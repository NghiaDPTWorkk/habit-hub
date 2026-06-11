import React from 'react'
import { Box, Container, Stack, Typography } from '@/components/ui'
import { GoalForm } from './GoalForm'
import { GoalPanel } from './GoalPanel'
import { GOALS_CONTENT } from '../constants/content'

export const GoalsPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {GOALS_CONTENT.PAGE_TITLE}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {GOALS_CONTENT.PAGE_DESC}
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {GOALS_CONTENT.FORM_TITLE_ADD}
        </Typography>
        <GoalForm />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {GOALS_CONTENT.PANEL_TITLE}
        </Typography>
        <GoalPanel />
      </Box>
    </Stack>
  </Container>
)
