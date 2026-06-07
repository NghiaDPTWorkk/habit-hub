import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { EmptyState } from '@/components/ui/EmptyState'
import { CheckInRow } from '../components/CheckInRow'
import { getGroupedCheckIns } from '@/services/CheckInsService'
import { getHabit } from '@/services/HabitsService'
import { useBoundStore } from '@/store/useBoundStore'
import { today } from '@/utils/dateUtils'
import { AppError } from '@/domain/AppError'

const PAGE_TITLE = 'Check-ins'

export function CheckInsPage() {
  const [selectedDate, setSelectedDate] = useState(today())

  const checkIns = useBoundStore((s) => s.checkIns)
  const habits = useBoundStore((s) => s.habits)

  const groupedCheckIns = useMemo(() => {
    void checkIns
    void habits
    try {
      return getGroupedCheckIns(selectedDate)
    } catch {
      return []
    }
  }, [selectedDate, checkIns, habits])

  const t = today()
  const dateLabel =
    selectedDate === t
      ? 'Today'
      : new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {PAGE_TITLE}
        </Typography>
        <input
          type="date"
          value={selectedDate}
          max={t}
          onChange={(e) => setSelectedDate(e.target.value || t)}
          style={{
            padding: '6px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {dateLabel}
      </Typography>

      {groupedCheckIns.length === 0 ? (
        <EmptyState
          title="Nothing scheduled on this day"
          description="No active habits are scheduled for this date."
        />
      ) : (
        <Card>
          <CardContent sx={{ p: '0 !important' }}>
            {groupedCheckIns.map((checkIn) => {
              let habit
              try {
                habit = getHabit(checkIn.habitId)
              } catch (err) {
                if (err instanceof AppError) return null
                return null
              }
              return (
                <Box key={checkIn.habitId} sx={{ px: 2 }}>
                  <CheckInRow
                    checkIn={checkIn}
                    habit={habit}
                    date={selectedDate}
                    readOnly={selectedDate < t}
                  />
                </Box>
              )
            })}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
