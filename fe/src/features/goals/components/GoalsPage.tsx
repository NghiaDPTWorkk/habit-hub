import React, { useState } from 'react'
import {
  Stack,
  Typography,
  Box,
  StatCard,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { GoalForm } from './GoalForm'
import { GoalPanel } from './GoalPanel'
import { GoalEditDialog } from './GoalEditDialog'
import { GOALS_CONTENT } from '../constants/content'
import { useBoundStore } from '@/store/useBoundStore'
import type { Goal } from '@/types'

const PAGE_TITLE = GOALS_CONTENT.PAGE_TITLE
const PAGE_DESC = GOALS_CONTENT.PAGE_DESC
const FORM_SECTION_TITLE = GOALS_CONTENT.FORM_TITLE_ADD
const PANEL_SECTION_TITLE = GOALS_CONTENT.PANEL_TITLE
const KPI_COMPLETED = GOALS_CONTENT.KPI.COMPLETED
const KPI_ACTIVE = GOALS_CONTENT.KPI.ACTIVE
const KPI_SUCCESS_RATE = GOALS_CONTENT.KPI.SUCCESS_RATE
const ACCORDION_LABEL = GOALS_CONTENT.ACCORDION_LABEL

export const GoalsPage: React.FC = () => {
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { goals, checkins, getGoalProgress } = useBoundStore()

  const completedCount = goals.filter(
    (goal) => getGoalProgress(goal, Object.values(checkins)).isCompleted
  ).length
  const activeCount = goals.length - completedCount
  const successRate = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0

  const handleEditGoal = (goal: Goal): void => {
    setEditingGoal(goal)
    setDialogOpen(true)
  }

  const handleDialogClose = (): void => {
    setEditingGoal(null)
    setDialogOpen(false)
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {PAGE_TITLE}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {PAGE_DESC}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          <StatCard
            title={KPI_COMPLETED}
            value={completedCount}
            icon={<Icons.Check />}
            sx={{ borderLeft: '4px solid', borderColor: 'success.main' }}
          />
          <StatCard
            title={KPI_ACTIVE}
            value={activeCount}
            icon={<Icons.TrendingUp />}
            sx={{ borderLeft: '4px solid', borderColor: 'primary.main' }}
          />
          <StatCard
            title={KPI_SUCCESS_RATE}
            value={`${successRate}%`}
            icon={<Icons.EmojiEvents />}
            sx={{ borderLeft: '4px solid', borderColor: 'secondary.main' }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Accordion
                expanded={accordionOpen}
                onChange={(_: React.SyntheticEvent, expanded: boolean) =>
                  setAccordionOpen(expanded)
                }
              >
                <AccordionSummary expandIcon={<Icons.ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {ACCORDION_LABEL}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <GoalForm onSuccess={() => setAccordionOpen(false)} />
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {FORM_SECTION_TITLE}
              </Typography>
              <GoalForm />
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {PANEL_SECTION_TITLE}
            </Typography>
            <GoalPanel onEditGoal={handleEditGoal} />
          </Box>
        </Box>
      </Stack>

      <GoalEditDialog
        key={editingGoal?.id}
        goal={editingGoal}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </Box>
  )
}
